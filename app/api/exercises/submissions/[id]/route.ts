import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;

    // 提出情報をDBから取得
    const submission = await prisma.exerciseSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "提出が見つかりませんでした" },
        { status: 404 }
      );
    }

    // resultsフィールドがあればJSONとしてパース
    const parsedResults = submission.results
      ? JSON.parse(submission.results)
      : null;

    // レスポンスを構築
    return NextResponse.json({
      submission: {
        id: submission.id,
        userId: submission.userId,
        exerciseId: submission.exerciseId,
        repositoryUrl: submission.repositoryUrl,
        status: submission.status,
        submittedAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        results: parsedResults,
      },
    });
  } catch (error) {
    console.error("提出取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "提出の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
