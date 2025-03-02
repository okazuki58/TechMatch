import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    // 管理者権限チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
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

    if (!badge.name || !badge.description || !badge.imageUrl) {
      return NextResponse.json(
        { error: "バッジ情報が不足しています" },
        { status: 400 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "問題が設定されていません" },
        { status: 400 }
      );
    }

    // クイズを作成
    const createdQuiz = await prisma.quiz.create({
      data: {
        name: quiz.name,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        badge: {
          create: {
            name: badge.name,
            description: badge.description,
            imageUrl: badge.imageUrl,
          },
        },
        questions: {
          create: questions.map(
            (q: {
              question: string;
              category: string;
              options: string[];
              correctAnswerIndex: number;
            }) => ({
              question: q.question,
              category: q.category,
              options: q.options,
              correctAnswerIndex: q.correctAnswerIndex,
            })
          ),
        },
      },
    });

    return NextResponse.json(createdQuiz);
  } catch (error) {
    console.error("クイズ作成エラー:", error);
    return NextResponse.json(
      { error: "クイズの作成に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 管理者権限チェック
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        badge: true,
        questions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("クイズ取得エラー:", error);
    return NextResponse.json(
      { error: "クイズの取得に失敗しました" },
      { status: 500 }
    );
  }
}
