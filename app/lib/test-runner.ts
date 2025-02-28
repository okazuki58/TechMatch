import { ExerciseSubmission, TestResult } from "./definitions";

export async function runTests(
  submission: ExerciseSubmission
): Promise<TestResult> {
  // 実際の実装では:
  // 1. リポジトリをクローン
  // 2. テスト環境をセットアップ
  // 3. テストを実行
  // 4. 結果を解析して返す

  // ここではモック実装
  console.log(
    `Running tests for submission: ${submission.id}, repository: ${submission.repositoryUrl}`
  );

  // テスト実行を模擬（実際にはGitリポジトリをクローンしてテストを実行）
  return new Promise((resolve) => {
    setTimeout(() => {
      // ランダムなテスト結果を生成
      const passed = Math.random() > 0.3;
      const score = Math.floor(Math.random() * 100);

      const result: TestResult = {
        id: `res-${Date.now()}`,
        submissionId: submission.id,
        exerciseId: submission.exerciseId,
        userId: submission.userId,
        passed,
        score,
        maxScore: 100,
        details: [
          {
            testName: "テスト1",
            passed: Math.random() > 0.2,
            message: passed ? "テストに合格しました" : "テストに失敗しました",
            expected: "期待される結果",
            actual: "実際の結果",
          },
          {
            testName: "テスト2",
            passed: Math.random() > 0.2,
            message: passed ? "テストに合格しました" : "テストに失敗しました",
          },
          {
            testName: "テスト3",
            passed: Math.random() > 0.2,
            message: passed ? "テストに合格しました" : "テストに失敗しました",
          },
        ],
        feedback: passed
          ? "おめでとうございます！すべてのテストに合格しました。"
          : "いくつかのテストに失敗しました。エラーメッセージを確認して修正してください。",
        completedAt: new Date(),
      };

      resolve(result);
    }, 3000); // テスト実行に3秒かかると仮定
  });
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: ExerciseSubmission["status"]
): Promise<void> {
  // 実際の実装ではデータベースの提出ステータスを更新
  console.log(`Updating submission ${submissionId} status to ${status}`);

  // 非同期処理をシミュレート
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}
