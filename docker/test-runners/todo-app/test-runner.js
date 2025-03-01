const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { execSync } = require("child_process");

// リポジトリと結果のパス
const REPO_PATH = "/app/repo";
const RESULTS_PATH = "/app/results";

// 演習IDを環境変数から取得
const exerciseId = process.env.EXERCISE_ID || "unknown";

async function runTests() {
  // 結果オブジェクト初期化
  const result = {
    passed: true,
    score: 0,
    maxScore: 100,
    details: [],
  };

  // Expressサーバーをセットアップして静的ファイルを提供
  const app = express();
  app.use(express.static(REPO_PATH));
  const server = app.listen(3000);

  try {
    // npmパッケージがある場合はインストール
    if (fs.existsSync(path.join(REPO_PATH, "package.json"))) {
      console.log("Installing dependencies...");
      execSync("cd /app/repo && npm install", { stdio: "inherit" });
    }

    // Puppeteerブラウザを起動
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // ローカルサーバーにアクセス
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // テスト1: 必要なUI要素が存在するか
    try {
      const inputExists = await page.$("#todo-input");
      const buttonExists = await page.$("#add-button");
      const listExists = await page.$(".todo-list, #todo-list, ul");

      if (inputExists && buttonExists && listExists) {
        result.details.push({
          testName: "UI要素の存在チェック",
          passed: true,
          message: "必要なUI要素が存在します",
        });
        result.score += 25;
      } else {
        result.passed = false;
        result.details.push({
          testName: "UI要素の存在チェック",
          passed: false,
          message:
            "必要なUI要素が見つかりません。#todo-input, #add-button, .todo-listが必要です",
        });
      }
    } catch (error) {
      result.passed = false;
      result.details.push({
        testName: "UI要素の存在チェック",
        passed: false,
        message: `エラー発生: ${error.message}`,
      });
    }

    // テスト2: タスク追加機能
    try {
      // テキスト入力フィールドにテキストを入力
      await page.type("#todo-input", "テストタスク");

      // 追加ボタンをクリック
      await page.click("#add-button");

      // タスクリストにアイテムが追加されたかチェック
      await page.waitForTimeout(500); // 処理完了を待つ

      const todoItems = await page.$$(".todo-item, li");

      if (todoItems.length > 0) {
        // タスクが追加されたかどうか内容をチェック
        const todoText = await page.evaluate(
          (el) => el.textContent,
          todoItems[0]
        );

        if (todoText.includes("テストタスク")) {
          result.details.push({
            testName: "タスク追加機能",
            passed: true,
            message: "タスクが正常に追加されました",
          });
          result.score += 25;
        } else {
          result.passed = false;
          result.details.push({
            testName: "タスク追加機能",
            passed: false,
            message:
              "タスクは追加されましたが、入力したテキストが表示されていません",
          });
        }
      } else {
        result.passed = false;
        result.details.push({
          testName: "タスク追加機能",
          passed: false,
          message: "タスクが追加されていません",
        });
      }
    } catch (error) {
      result.passed = false;
      result.details.push({
        testName: "タスク追加機能",
        passed: false,
        message: `エラー発生: ${error.message}`,
      });
    }

    // テスト3: タスク完了機能
    try {
      // 完了ボタンまたはチェックボックスを探す
      const completeButton = await page.$(
        ".complete-button, input[type=checkbox], .todo-item button"
      );

      if (completeButton) {
        // 完了ボタンをクリック
        await completeButton.click();
        await page.waitForTimeout(500);

        // 完了状態になったかチェック (classまたはスタイルで判断)
        const completedItem = await page.$(
          '.completed, .done, [style*="text-decoration: line-through"]'
        );

        if (completedItem) {
          result.details.push({
            testName: "タスク完了機能",
            passed: true,
            message: "タスクを完了状態に変更できます",
          });
          result.score += 25;
        } else {
          result.passed = false;
          result.details.push({
            testName: "タスク完了機能",
            passed: false,
            message: "タスクの完了状態への変更が機能していません",
          });
        }
      } else {
        result.passed = false;
        result.details.push({
          testName: "タスク完了機能",
          passed: false,
          message: "完了ボタンまたはチェックボックスが見つかりません",
        });
      }
    } catch (error) {
      result.passed = false;
      result.details.push({
        testName: "タスク完了機能",
        passed: false,
        message: `エラー発生: ${error.message}`,
      });
    }

    // テスト4: タスク削除機能
    try {
      // 削除ボタンを探す
      const deleteButton = await page.$(
        ".delete-button, .remove-button, .todo-item button:last-child"
      );

      if (deleteButton) {
        // 削除前のタスク数を取得
        const beforeCount = (await page.$$(".todo-item, li")).length;

        // 削除ボタンをクリック
        await deleteButton.click();
        await page.waitForTimeout(500);

        // 削除後のタスク数を取得
        const afterCount = (await page.$$(".todo-item, li")).length;

        if (afterCount < beforeCount) {
          result.details.push({
            testName: "タスク削除機能",
            passed: true,
            message: "タスクを削除できます",
          });
          result.score += 25;
        } else {
          result.passed = false;
          result.details.push({
            testName: "タスク削除機能",
            passed: false,
            message: "タスクの削除が機能していません",
          });
        }
      } else {
        result.passed = false;
        result.details.push({
          testName: "タスク削除機能",
          passed: false,
          message: "削除ボタンが見つかりません",
        });
      }
    } catch (error) {
      result.passed = false;
      result.details.push({
        testName: "タスク削除機能",
        passed: false,
        message: `エラー発生: ${error.message}`,
      });
    }

    // ブラウザを閉じる
    await browser.close();
  } catch (error) {
    result.passed = false;
    result.details.push({
      testName: "システムエラー",
      passed: false,
      message: `テスト実行中にエラーが発生しました: ${error.message}`,
    });
  } finally {
    // Expressサーバーを停止
    server.close();

    // 結果をJSONファイルに書き出し
    fs.writeFileSync(
      path.join(RESULTS_PATH, "output.json"),
      JSON.stringify(result, null, 2)
    );
    console.log("テスト完了、結果を保存しました");
  }
}

// テストを実行
runTests().catch((error) => {
  console.error("テスト実行エラー:", error);

  // エラー時も結果ファイルを作成
  const errorResult = {
    passed: false,
    score: 0,
    maxScore: 100,
    details: [
      {
        testName: "致命的エラー",
        passed: false,
        message: `テスト実行が失敗しました: ${error.message}`,
      },
    ],
  };

  fs.writeFileSync(
    path.join(RESULTS_PATH, "output.json"),
    JSON.stringify(errorResult, null, 2)
  );
});
