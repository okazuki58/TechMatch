import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runTests } from "@/app/lib/test-runner";
import { TestDetail } from "@/app/lib/definitions";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body = await request.json();
    const { userId, exerciseId, repositoryUrl } = body;

    if (!exerciseId || !repositoryUrl) {
      return NextResponse.json(
        { error: "演習IDとリポジトリURLは必須です" },
        { status: 400 }
      );
    }

    // 提出を保存
    const submission = await prisma.exerciseSubmission.create({
      data: {
        userId: userId || "guest-user",
        exerciseId,
        repositoryUrl,
        status: "pending",
      },
    });

    // 非同期でテストを実行
    updateSubmissionStatus(submission.id, "testing")
      .then(() => runTests({
        id: submission.id,
        userId: submission.userId,
        exerciseId: submission.exerciseId,
        repositoryUrl: submission.repositoryUrl,
        status: submission.status,
        submittedAt: submission.createdAt,
        results: null,
      }))
      .then((result) => {
        // テスト結果を保存
        return saveTestResult({
          id: `test-${submission.id}`,
          submissionId: submission.id,
          exerciseId: submission.exerciseId,
          userId: submission.userId,
          passed: result.passed,
          score: result.score,
          maxScore: 100,
          details: result.details as TestDetail[],
          feedback: result.passed
            ? "おめでとうございます！すべてのテストに合格しました。"
            : "いくつかのテストに失敗しました。エラーメッセージを確認して修正してください。",
          completedAt: new Date(),
          createdAt: new Date(),
        });
      })
      .catch((error) => {
        console.error("テスト実行中にエラーが発生しました:", error);
        updateSubmissionStatus(submission.id, "failed");
      });

    return NextResponse.json({
      submission: {
        id: submission.id,
        userId: submission.userId,
        exerciseId: submission.exerciseId,
        repositoryUrl: submission.repositoryUrl,
        status: submission.status,
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error("提出処理中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "提出処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 提出ステータスを更新する関数
async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<void> {
  await prisma.exerciseSubmission.update({
    where: { id: submissionId },
    data: { status },
  });
}

interface TestResultData {
  id: string;
  submissionId: string;
  exerciseId: string;
  userId: string;
  passed: boolean;
  score: number;
  maxScore: number;
  details: TestDetail[];
  feedback: string;
  completedAt: Date;
  createdAt: Date;
}

// テスト結果を保存する関数
async function saveTestResult(result: TestResultData): Promise<void> {
  // テスト結果をJSON文字列に変換
  const resultJson = JSON.stringify({
    passed: result.passed,
    score: result.score,
    maxScore: result.maxScore,
    details: result.details,
    feedback: result.feedback,
    completedAt: result.completedAt,
  });

  // 提出情報を更新
  await prisma.exerciseSubmission.update({
    where: { id: result.submissionId },
    data: {
      status: "completed",
      results: resultJson,
    },
  });
}