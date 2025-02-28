import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { ExerciseSubmission, TestResult } from "./definitions";
import puppeteer from "puppeteer";

// 一時ディレクトリのパス
const TEMP_DIR = path.join(process.cwd(), "temp");

export async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<void> {
  // TODO: データベースでステータスを更新
  console.log(`Submission ${submissionId} status updated to: ${status}`);
}

export async function runTests(
  submission: ExerciseSubmission
): Promise<TestResult> {
  const { id: submissionId, repositoryUrl, exerciseId } = submission;
  const repoDir = path.join(TEMP_DIR, submissionId);

  console.log(
    `Running tests for submission: ${submissionId}, repository: ${repositoryUrl}`
  );

  try {
    // 一時ディレクトリが存在しない場合は作成
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // リポジトリをクローン
    const git = simpleGit();
    await git.clone(repositoryUrl, repoDir);
    console.log(`Repository cloned to ${repoDir}`);

    // Todoアプリのテスト実行
    const testResults = await testTodoApp(repoDir);

    // テスト後にディレクトリを削除
    fs.rmSync(repoDir, { recursive: true, force: true });

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
  } catch (error) {
    console.error("Test execution error:", error);

    // エラー発生時もディレクトリを削除
    if (fs.existsSync(repoDir)) {
      fs.rmSync(repoDir, { recursive: true, force: true });
    }

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

async function testTodoApp(repoDir: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // HTMLファイルのパスを取得
  const htmlPath = `file://${path.join(repoDir, "index.html")}`;

  // テスト結果を格納する配列
  const testDetails = [];
  let totalPassed = 0;

  try {
    // HTMLファイルを開く
    await page.goto(htmlPath);

    // テスト1: 入力フィールドとボタンが存在するか
    const inputExists = await page.evaluate(() => {
      return !!document.getElementById("todo-input");
    });
    const buttonExists = await page.evaluate(() => {
      return !!document.getElementById("add-button");
    });

    testDetails.push({
      testName: "UIコンポーネントの存在",
      passed: inputExists && buttonExists,
      message:
        inputExists && buttonExists
          ? "入力フィールドとボタンが正しく実装されています"
          : "入力フィールドまたはボタンが見つかりません",
    });

    if (inputExists && buttonExists) totalPassed++;

    // テスト2: タスクを追加できるか
    const taskText = "テストタスク";
    await page.type("#todo-input", taskText);
    await page.click("#add-button");

    const taskAdded = await page.evaluate((text) => {
      const items = document.querySelectorAll(".todo-item");
      return Array.from(items).some((item) => item.textContent?.includes(text));
    }, taskText);

    testDetails.push({
      testName: "タスク追加機能",
      passed: taskAdded,
      message: taskAdded
        ? "タスクが正しく追加されました"
        : "タスクの追加に失敗しました",
    });

    if (taskAdded) totalPassed++;

    // テスト3: タスクを完了としてマークできるか
    if (taskAdded) {
      await page.click(".todo-text");
      const taskCompleted = await page.evaluate(() => {
        return !!document.querySelector(".completed");
      });

      testDetails.push({
        testName: "タスク完了機能",
        passed: taskCompleted,
        message: taskCompleted
          ? "タスクを完了としてマークできました"
          : "タスクを完了としてマークできません",
      });

      if (taskCompleted) totalPassed++;
    }

    // テスト4: タスクを削除できるか
    if (taskAdded) {
      const initialCount = await page.evaluate(() => {
        return document.querySelectorAll(".todo-item").length;
      });

      await page.click(".delete-btn");

      const newCount = await page.evaluate(() => {
        return document.querySelectorAll(".todo-item").length;
      });

      const taskDeleted = newCount < initialCount;

      testDetails.push({
        testName: "タスク削除機能",
        passed: taskDeleted,
        message: taskDeleted
          ? "タスクが正しく削除されました"
          : "タスクの削除に失敗しました",
      });

      if (taskDeleted) totalPassed++;
    }
  } catch (error) {
    console.error("Puppeteer test error:", error);
    testDetails.push({
      testName: "テスト実行エラー",
      passed: false,
      message: `テスト実行中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  } finally {
    await browser.close();
  }

  // 総合スコアを計算
  const totalTests = 4;
  const score = Math.round((totalPassed / totalTests) * 100);

  return {
    passed: totalPassed === totalTests,
    score,
    details: testDetails,
  };
}
