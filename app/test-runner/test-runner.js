import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

// コンテナ内のパス設定
const REPO_DIR = "/app/repo";
const RESULTS_PATH = "/app/results/output.json";
const HTML_PATH = `file://${path.join(REPO_DIR, "index.html")}`;

// テスト実行関数
async function testTodoApp() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // テスト結果を格納する配列
  const testDetails = [];
  let totalPassed = 0;

  try {
    console.log(`HTMLファイルを開きます: ${HTML_PATH}`);
    // HTMLファイルを開く
    await page.goto(HTML_PATH);

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
      message: `テスト実行中にエラーが発生しました: ${error.message}`,
    });
  } finally {
    await browser.close();
  }

  // 総合スコアを計算
  const totalTests = 4;
  const score = Math.round((totalPassed / totalTests) * 100);

  const results = {
    passed: totalPassed === totalTests,
    score,
    details: testDetails,
  };

  // 結果をファイルに書き込む
  console.log("テスト結果を保存します:", JSON.stringify(results, null, 2));
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results));

  return results;
}

// 環境変数からパラメータを取得
const exerciseId = process.env.EXERCISE_ID || "unknown";
console.log(`演習ID: ${exerciseId}のテストを実行します`);

// テスト実行
testTodoApp()
  .then((results) => {
    console.log(
      `テスト完了: ${results.passed ? "成功" : "失敗"}, スコア: ${
        results.score
      }`
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("テスト実行中の予期せぬエラー:", error);
    // エラー時も結果を出力
    const errorResults = {
      passed: false,
      score: 0,
      details: [
        {
          testName: "システムエラー",
          passed: false,
          message: `テスト実行中にシステムエラーが発生しました: ${error.message}`,
        },
      ],
    };

    fs.writeFileSync(RESULTS_PATH, JSON.stringify(errorResults));
    process.exit(1);
  });
