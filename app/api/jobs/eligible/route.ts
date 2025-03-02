import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type RequiredQuiz = {
  quizId: string;
  minimumScore: number;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // ユーザーのクイズ結果を取得
    const userQuizResults = await prisma.quizResult.findMany({
      where: { userId: session.user.id as string },
      select: {
        quizId: true,
        score: true,
        maxScore: true,
      },
    });

    // すべての求人を取得
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    // ユーザーが応募資格のある求人をフィルタリング
    const eligibleJobs = jobs.filter((job) => {
      // 必須テストがない場合は応募可能
      if (!job.requiredQuizzes || job.requiredQuizzes.length === 0) {
        return true;
      }

      // すべての必須テストで最低スコアを満たしているか確認
      return (job.requiredQuizzes as RequiredQuiz[]).every((requiredQuiz) => {
        const userResult = userQuizResults.find(
          (result) => result.quizId === requiredQuiz.quizId
        );

        if (!userResult) return false;

        const percentageScore = (userResult.score / userResult.maxScore) * 100;
        return percentageScore >= requiredQuiz.minimumScore;
      });
    });

    return NextResponse.json(eligibleJobs);
  } catch (error) {
    console.error("応募資格のある求人取得エラー:", error);
    return NextResponse.json(
      { error: "応募資格のある求人の取得に失敗しました" },
      { status: 500 }
    );
  }
}
