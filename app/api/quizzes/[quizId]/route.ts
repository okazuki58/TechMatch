import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    console.log("クイズ取得リクエスト", params.quizId);

    if (!params.quizId) {
      return NextResponse.json(
        { error: "クイズIDが必要です" },
        { status: 400 }
      );
    }
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: params.quizId,
      },
      include: {
        questions: true,
        badge: true,
      },
    });

    if (!quiz) {
      console.log("クイズが見つかりません:", params.quizId);
      return NextResponse.json(
        { error: "クイズが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("クイズ取得エラー:", error);
    return NextResponse.json(
      { error: "クイズの取得に失敗しました" },
      { status: 500 }
    );
  }
}
