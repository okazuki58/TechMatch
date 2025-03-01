import { ExerciseSubmission, TestResult } from "../definitions";
import path from "path";
import fs from "fs";
import simpleGit from "simple-git";
import { spawn } from "child_process";
import { TestResultData } from "./type";

// 一時ディレクトリのパス
const TEMP_DIR = path.join(process.cwd(), "temp");
// 結果ディレクトリのパス
const RESULTS_DIR = path.join(process.cwd(), "temp", "results");

export abstract class BaseTestRunner {
  protected submission: ExerciseSubmission;
  protected repoDir: string;
  protected resultDir: string;

  constructor(submission: ExerciseSubmission) {
    this.submission = submission;
    this.repoDir = path.join(TEMP_DIR, submission.id);
    this.resultDir = path.join(RESULTS_DIR, submission.id);
  }

  // リポジトリクローンと環境セットアップの共通処理
  protected async setup(): Promise<void> {
    // 一時ディレクトリが存在しない場合は作成
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // 結果ディレクトリの作成
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR, { recursive: true });
    }

    if (!fs.existsSync(this.resultDir)) {
      fs.mkdirSync(this.resultDir, { recursive: true });
    }

    // リポジトリをクローン
    const git = simpleGit();
    await git.clone(this.submission.repositoryUrl, this.repoDir);
  }

  // クリーンアップ共通処理
  protected async cleanup(): Promise<void> {
    if (fs.existsSync(this.repoDir)) {
      fs.rmSync(this.repoDir, { recursive: true, force: true });
    }
    if (fs.existsSync(this.resultDir)) {
      fs.rmSync(this.resultDir, { recursive: true, force: true });
    }
  }

  

  protected abstract getDockerImage(): string;
  protected abstract getExtraDockerArgs(): string[];
  protected abstract parseTestResults(resultData: TestResultData): TestResult;

  // テスト実行の共通フロー
  public async runTest(): Promise<TestResult> {
    try {
      await this.setup();

      // Docker実行
      const dockerArgs = [
        "run",
        "--rm",
        "--cpus=0.5",
        "--memory=512m",
        "--network=none",
        "-v",
        `${this.repoDir}:/app/repo:ro`,
        "-v",
        `${this.resultDir}:/app/results:rw`,
        "-e",
        `EXERCISE_ID=${this.submission.exerciseId}`,
        ...this.getExtraDockerArgs(),
        this.getDockerImage(),
      ];

      await this.executeCommand("docker", dockerArgs);

      // 結果ファイルを読み込む
      const resultFile = path.join(this.resultDir, "output.json");
      if (!fs.existsSync(resultFile)) {
        throw new Error("テスト結果ファイルが見つかりません");
      }

      const resultData = JSON.parse(fs.readFileSync(resultFile, "utf8"));
      const testResult = this.parseTestResults(resultData);

      await this.cleanup();
      return testResult;
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  // コマンド実行ヘルパーメソッド
  protected async executeCommand(
    command: string,
    args: string[]
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
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
}
