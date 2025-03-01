import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const session = await getServerSession(authOptions);
    const userWithRole = session?.user as { role?: string };
    if (!session || userWithRole.role !== "admin") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        badge: true,
        questions: true,
      },
    });

    if (!quiz) {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const session = await getServerSession(authOptions);
    const userWithRole = session?.user as { role?: string };
    if (!session || userWithRole.role !== "admin") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const { quiz, badge, questions } = await request.json();

    // バリデーション
    if (!quiz.name || !quiz.description || !quiz.category || !quiz.difficulty) {
      return NextResponse.json(
        { error: "クイズの基本情報が不足しています" },
        { status: 400 }
      );
    }

    // クイズを更新
    const updatedQuiz = await prisma.quiz.update({
      where: { id: params.id },
      data: {
        name: quiz.name,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
      },
    });

    // バッジを更新
    if (badge) {
      await prisma.quizBadge.update({
        where: { quizId: params.id },
        data: {
          name: badge.name,
          description: badge.description,
          imageUrl: badge.imageUrl,
        },
      });
    }

    // 既存の質問を削除
    await prisma.question.deleteMany({
      where: { quizId: params.id },
    });

    // 新しい質問を作成
    for (const question of questions) {
      await prisma.question.create({
        data: {
          quizId: params.id,
          question: question.question,
          category: question.category,
          options: question.options,
          correctAnswerIndex: question.correctAnswerIndex,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("クイズ更新エラー:", error);
    return NextResponse.json(
      { error: "クイズの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const session = await getServerSession(authOptions);
    const userWithRole = session?.user as { role?: string };
    if (!session || userWithRole.role !== "admin") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    // クイズを削除（関連するバッジと質問も自動的に削除される）
    await prisma.quiz.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("クイズ削除エラー:", error);
    return NextResponse.json(
      { error: "クイズの削除に失敗しました" },
      { status: 500 }
    );
  }
}
