import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { quizzes } from "@/app/lib/quizzes";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    // ユーザーのクイズ結果を取得
    const quizResultsFromDB = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
    });

    // クイズ名を追加
    const quizResults = quizResultsFromDB.map((result) => {
      const quiz = quizzes.find((q) => q.id === result.quizId);
      return {
        ...result,
        quizName: quiz ? quiz.name : "不明なテスト",
      };
    });

    // ユーザーのバッジを取得
    const badges = await prisma.badge.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ quizResults, badges });
  } catch (error) {
    console.error("ユーザーデータ取得エラー:", error);
    return NextResponse.json(
      { error: "データ取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
