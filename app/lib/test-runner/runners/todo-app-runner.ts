import { TestResult } from "../../definitions";
import { BaseTestRunner } from "../base-runner";
import { TestResultData } from "../type";

export class TodoAppTestRunner extends BaseTestRunner {
  protected getDockerImage(): string {
    return "todo-app-test-runner";
  }

  protected getExtraDockerArgs(): string[] {
    return [
      // TodoApp特有の追加引数があれば設定
    ];
  }

  protected parseTestResults(resultData: TestResultData): TestResult {
    return {
      id: `res-${Date.now()}`,
      submissionId: this.submission.id,
      exerciseId: this.submission.exerciseId,
      userId: this.submission.userId,
      passed: resultData.passed,
      score: resultData.score,
      maxScore: 100,
      details: resultData.details,
      feedback: resultData.passed
        ? "おめでとうございます！すべてのテストに合格しました。"
        : "いくつかのテストに失敗しました。エラーメッセージを確認して修正してください。",
      createdAt: new Date(),
      completedAt: new Date(),
      status: "completed",
    };
  }
}
