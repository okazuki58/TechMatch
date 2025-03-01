import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { saveQuizResult } from "@/app/lib/data";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { quizId, score, maxScore } = await request.json();

    // 入力検証
    if (!quizId || typeof score !== "number" || typeof maxScore !== "number") {
      return NextResponse.json(
        { error: "無効なリクエストデータです" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // クイズ結果を保存
    const { quizResult, newBadge } = await saveQuizResult(
      userId,
      quizId,
      score,
      maxScore
    );

    return NextResponse.json({ quizResult, newBadge });
  } catch (error) {
    console.error("テスト結果の保存中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "テスト結果の保存中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
