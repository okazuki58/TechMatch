import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const submissionId = request.nextUrl.searchParams.get("submissionId");

  if (!submissionId) {
    return NextResponse.json({ error: "提出IDは必須です" }, { status: 400 });
  }

  try {
    const submission = await prisma.exerciseSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "提出情報が見つかりません" },
        { status: 404 }
      );
    }

    // 結果がまだない場合
    if (!submission.results) {
      return NextResponse.json({
        result: {
          id: `test-${submissionId}`,
          submissionId,
          exerciseId: submission.exerciseId,
          userId: submission.userId,
          passed: false,
          score: 0,
          maxScore: 100,
          details: [],
          feedback: "テスト実行中です。しばらくお待ちください。",
          completedAt: null,
          createdAt: submission.createdAt,
          status: submission.status, // "pending" または "testing"
        },
      });
    }

    // JSON文字列からオブジェクトに変換
    const resultData = JSON.parse(submission.results);

    const result = {
      id: `test-${submissionId}`,
      submissionId,
      exerciseId: submission.exerciseId,
      userId: submission.userId,
      passed: resultData.passed,
      score: resultData.score,
      maxScore: resultData.maxScore || 100,
      details: resultData.details,
      feedback: resultData.feedback,
      completedAt: resultData.completedAt
        ? new Date(resultData.completedAt)
        : null,
      createdAt: submission.createdAt,
      status: submission.status,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error("テスト結果の取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "テスト結果の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
