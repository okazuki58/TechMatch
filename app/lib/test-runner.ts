import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { ExerciseSubmission, TestResult } from "./definitions";
import { prisma } from "@/app/lib/db";
import { spawn } from "child_process";

// 一時ディレクトリのパス
const TEMP_DIR = path.join(process.cwd(), "temp");
// 結果ディレクトリのパス
const RESULTS_DIR = path.join(process.cwd(), "temp", "results");

// 非同期でシェルコマンドを実行する関数
async function executeCommand(
  command: string,
  args: string[],
  options = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, options);
    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`コマンド実行エラー (${code}): ${stderr}`));
      }
    });
  });
}

// タイムアウト付きの非同期処理
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<void> {
  // Prismaを使用してステータス更新
  await prisma.exerciseSubmission.update({
    where: { id: submissionId },
    data: { status },
  });
  console.log(`Submission ${submissionId} status updated to: ${status}`);
}

export async function runTests(
  submission: ExerciseSubmission
): Promise<TestResult> {
  const { id: submissionId, repositoryUrl, exerciseId } = submission;
  const repoDir = path.join(TEMP_DIR, submissionId);
  const resultDir = path.join(RESULTS_DIR, submissionId);

  console.log(
    `Running tests for submission: ${submissionId}, repository: ${repositoryUrl}`
  );

  try {
    // ステータスを「テスト中」に更新
    await updateSubmissionStatus(submissionId, "testing");

    // 一時ディレクトリが存在しない場合は作成
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // 結果ディレクトリの作成
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true });
    }

    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir, { recursive: true });
    }

    // リポジトリをクローン（タイムアウト設定）
    const git = simpleGit();
    await withTimeout(
      git.clone(repositoryUrl, repoDir),
      30000,
      "リポジトリのクローンがタイムアウトしました"
    );
    console.log(`Repository cloned to ${repoDir}`);

    // Dockerコンテナでテストを実行
    try {
      // コンテナの実行（タイムアウト付き）
      await withTimeout(
        executeCommand("docker", [
          "run",
          "--rm", // コンテナ終了後に削除
          "--cpus=0.5", // CPU使用率を制限
          "--memory=512m", // メモリ上限を512MBに制限
          "--network=none", // ネットワークアクセスを無効化
          "-v",
          `${repoDir}:/app/repo:ro`, // リポジトリを読み取り専用でマウント
          "-v",
          `${resultDir}:/app/results:rw`, // 結果ディレクトリを書き込み可能でマウント
          "-e",
          `EXERCISE_ID=${exerciseId}`, // 演習IDを環境変数として渡す
          "puppeteer-test-runner", // 使用するDockerイメージ名
        ]),
        60000, // 60秒タイムアウト
        "テスト実行がタイムアウトしました"
      );

      // 結果ファイルを読み込む
      const resultFile = path.join(resultDir, "output.json");
      if (!fs.existsSync(resultFile)) {
        throw new Error("テスト結果ファイルが見つかりません");
      }

      const resultData = JSON.parse(fs.readFileSync(resultFile, "utf8"));
      const testResults = {
        passed: resultData.passed,
        score: resultData.score,
        details: resultData.details,
      };

      // テスト後にディレクトリを削除
      fs.rmSync(repoDir, { recursive: true, force: true });
      fs.rmSync(resultDir, { recursive: true, force: true });

      // ステータスを「完了」に更新
      await updateSubmissionStatus(
        submissionId,
        testResults.passed ? "completed" : "failed"
      );

      return {
        id: `res-${Date.now()}`,
        submissionId,
        exerciseId,
        userId: submission.userId,
        passed: testResults.passed,
        score: testResults.score,
        maxScore: 100,
        details: testResults.details,
        feedback: testResults.passed
          ? "おめでとうございます！すべてのテストに合格しました。"
          : "いくつかのテストに失敗しました。エラーメッセージを確認して修正してください。",
        createdAt: new Date(),
        completedAt: new Date(),
        status: "completed",
      };
    } catch (dockerError) {
      console.error("Docker実行エラー:", dockerError);

      // テスト失敗として処理
      // ステータスを「失敗」に更新
      await updateSubmissionStatus(submissionId, "failed");

      return {
        id: `res-${Date.now()}`,
        submissionId,
        exerciseId,
        userId: submission.userId,
        passed: false,
        score: 0,
        maxScore: 100,
        details: [
          {
            testName: "テスト実行エラー",
            passed: false,
            message: `テスト実行中にエラーが発生しました: ${
              dockerError instanceof Error ? dockerError.message : String(dockerError)
            }`,
          },
        ],
        feedback:
          "テスト実行中にエラーが発生しました。システム管理者にお問い合わせください。",
        createdAt: new Date(),
        completedAt: new Date(),
        status: "failed",
      };
    }
  } catch (error) {
    console.error("Test execution error:", error);

    // エラー発生時もディレクトリを削除
    if (fs.existsSync(repoDir)) {
      fs.rmSync(repoDir, { recursive: true, force: true });
    }
    if (fs.existsSync(resultDir)) {
      fs.rmSync(resultDir, { recursive: true, force: true });
    }

    // ステータスを「失敗」に更新
    await updateSubmissionStatus(submissionId, "failed");

    return {
      id: `res-${Date.now()}`,
      submissionId,
      exerciseId,
      userId: submission.userId,
      passed: false,
      score: 0,
      maxScore: 100,
      details: [
        {
          testName: "リポジトリテスト",
          passed: false,
          message: `テスト実行中にエラーが発生しました: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      feedback:
        "テスト実行中にエラーが発生しました。リポジトリURLが正しいか確認してください。",
      createdAt: new Date(),
      completedAt: new Date(),
      status: "failed",
    };
  }
}
