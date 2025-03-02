import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  console.log("統計情報API呼び出し");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log("未認証ユーザー");
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    // メールアドレスでユーザーを検索（クイズ結果の保存と同じ方法）
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log(`ユーザーが見つかりません: ${session.user.email}`);
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    console.log(`ユーザーID: ${user.id} の統計を取得中`);

    // クイズ結果を取得
    const quizResults = await prisma.quizResult.findMany({
      where: { userId: user.id },
      include: { quiz: true },
      orderBy: { completedAt: "desc" },
    });

    console.log(`取得したクイズ結果数: ${quizResults.length}`);

    // バッジを取得
    const badges = await prisma.badge.findMany({
      where: { userId: user.id },
    });

    console.log(`取得したバッジ数: ${badges.length}`);

    // 演習提出を取得する処理を追加
    const exerciseSubmissions = await prisma.exerciseSubmission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // 結果をフォーマット
    const formattedResults = quizResults.map((result) => ({
      id: result.id,
      quizId: result.quizId,
      quizName: result.quiz.name,
      score: result.score,
      maxScore: result.maxScore,
      completedAt: result.completedAt,
    }));

    return NextResponse.json({
      quizResults: formattedResults,
      badges: badges,
      exerciseSubmissions: exerciseSubmissions,
    });
  } catch (error) {
    console.error("統計取得エラー:", error);
    return NextResponse.json(
      { error: "統計情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
