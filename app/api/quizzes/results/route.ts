import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    console.log("受信したクイズ結果:", {
      quizId: body.quizId,
      score: body.score,
      scoreType: typeof body.score,
      maxScore: body.maxScore,
      maxScoreType: typeof body.maxScore,
    });

    // セッションチェック
    if (!session?.user?.email) {
      console.log("未認証ユーザー");
      return NextResponse.json({
        quizResult: {
          id: `temp-${Date.now()}`,
          quizId: body.quizId,
          quizName: "クイズ",
          score: body.score,
          maxScore: body.maxScore,
          completedAt: new Date(),
        },
        newBadge: null,
      });
    }

    // ユーザーをメールアドレスで検索
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error(`ユーザーが見つかりません: ${session.user.email}`);
      return NextResponse.json(
        { error: "ユーザーが見つかりません。再ログインしてください。" },
        { status: 404 }
      );
    }

    const userId = user.id;

    // 必須パラメーターチェック
    if (!body.quizId || body.score === undefined || !body.maxScore) {
      return NextResponse.json(
        { error: "必須パラメーターが不足しています" },
        { status: 400 }
      );
    }

    const score = Number(body.score);
    const maxScore = Number(body.maxScore);

    console.log(`変換後スコア: ${score}/${maxScore}`);

    // 既存の結果を確認
    const existingResult = await prisma.quizResult.findFirst({
      where: {
        quizId: body.quizId,
        userId: userId,
      },
      include: {
        quiz: true,
      },
    });

    let quizResult;
    let newBadge = null;

    // 常に最新の結果を保存するように修正
    if (existingResult) {
      // 既存結果があれば常に更新
      quizResult = await prisma.quizResult.update({
        where: { id: existingResult.id },
        data: {
          score: score,
          maxScore: maxScore,
          completedAt: new Date(),
        },
        include: { quiz: true },
      });
    } else {
      // 新規作成
      quizResult = await prisma.quizResult.create({
        data: {
          quiz: { connect: { id: body.quizId } },
          user: { connect: { id: userId } },
          score: score,
          maxScore: maxScore,
          completedAt: new Date(),
        },
        include: { quiz: true },
      });
    }

    // バッジの確認（初回のみ）
    if (!existingResult && score >= maxScore * 0.8) {
      // 初めて80%以上のスコアを獲得した場合、バッジを付与
      const quiz = await prisma.quiz.findUnique({
        where: { id: body.quizId },
        include: { badge: true },
      });

      if (quiz?.badge) {
        // ユーザーにバッジを付与
        await prisma.badge.create({
          data: {
            user: {
              connect: { id: userId },
            },
            quiz: {
              connect: { id: quiz.id },
            },
            name: quiz.badge.name,
            description: quiz.badge.description,
            imageUrl: quiz.badge.imageUrl,
            achievedAt: new Date(),
          },
        });

        newBadge = quiz.badge;
      }
    }

    return NextResponse.json({
      quizResult: {
        id: quizResult.id,
        quizId: quizResult.quizId,
        quizName: quizResult.quiz?.name || "クイズ",
        score: quizResult.score,
        maxScore: quizResult.maxScore,
        completedAt: quizResult.completedAt,
      },
      newBadge,
    });
  } catch (error) {
    console.error("クイズ結果保存エラー:", error);
    // エラーの詳細情報を追加
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラースタック:", error.stack);
    }
    return NextResponse.json(
      { error: "クイズ結果の保存に失敗しました" },
      { status: 500 }
    );
  }
}
