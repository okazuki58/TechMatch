import { ExerciseSubmission, TestResult } from "./definitions";
import { prisma } from "@/app/lib/db";
import { TestRunnerFactory } from "./test-runner/factory";

// 提出ステータスを更新する関数
export async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<void> {
  await prisma.exerciseSubmission.update({
    where: { id: submissionId },
    data: { status },
  });
  console.log(`Submission ${submissionId} status updated to: ${status}`);
}

// テスト実行のメイン関数
export async function runTests(
  submission: ExerciseSubmission
): Promise<TestResult> {
  console.log(
    `Running tests for submission: ${submission.id}, repository: ${submission.repositoryUrl}`
  );

  try {
    // ステータスを「テスト中」に更新
    await updateSubmissionStatus(submission.id, "testing");

    // ファクトリーを使って適切なテストランナーを取得
    const runner = await TestRunnerFactory.createRunner(submission);

    // テスト実行
    const testResult = await runner.runTest();

    // ステータスを更新
    await updateSubmissionStatus(
      submission.id,
      testResult.passed ? "completed" : "failed"
    );

    return testResult;
  } catch (error) {
    console.error("Test execution error:", error);

    // ステータスを「失敗」に更新
    await updateSubmissionStatus(submission.id, "failed");

    return {
      id: `res-${Date.now()}`,
      submissionId: submission.id,
      exerciseId: submission.exerciseId,
      userId: submission.userId,
      passed: false,
      score: 0,
      maxScore: 100,
      details: [
        {
          testName: "システムエラー",
          passed: false,
          message: `テスト実行中にエラーが発生しました: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      feedback:
        "テスト実行中にエラーが発生しました。サポートにお問い合わせください。",
      createdAt: new Date(),
      completedAt: new Date(),
      status: "failed",
    };
  }
}
