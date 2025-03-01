import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { quizId, score, maxScore, completedAt } = await request.json();

    // 入力検証
    if (!quizId || typeof score !== "number" || typeof maxScore !== "number") {
      return NextResponse.json(
        { error: "無効なリクエストデータです" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // クイズ結果を保存
    const quizResult = await prisma.quizResult.create({
      data: {
        quizId,
        userId,
        score,
        maxScore,
        completedAt: completedAt ? new Date(completedAt) : new Date(),
      },
    });

    // バッジ獲得条件をチェック
    const scorePercentage = (score / maxScore) * 100;
    let newBadge = null;

    // ユーザーが既にこのクイズのバッジを持っているか確認
    const existingBadge = await prisma.badge.findFirst({
      where: {
        userId: session.user.id,
        quizId,
      },
    });

    // バッジ獲得条件（クイズIDによって異なる）
    if (!existingBadge) {
      let badgeEarned = false;
      let badgeName = "";
      let badgeDescription = "";
      let badgeImageUrl = "";

      if (quizId === "quiz-001" && scorePercentage >= 80) {
        badgeEarned = true;
        badgeName = "Web基礎マスター";
        badgeDescription = "Web概論テストで80%以上の正解率を達成";
        badgeImageUrl = "/badges/web-basic-badge.svg";
      } else if (quizId === "quiz-002" && scorePercentage === 100) {
        badgeEarned = true;
        badgeName = "チーム開発マスター";
        badgeDescription = "Gitとチーム開発テストで全問正解";
        badgeImageUrl = "/badges/git-team-badge.svg";
      } else if (quizId === "quiz-003" && scorePercentage >= 80) {
        badgeEarned = true;
        badgeName = "JavaScript達人";
        badgeDescription = "JavaScriptテストで80%以上の正解率を達成";
        badgeImageUrl = "/badges/javascript-badge.svg";
      }

      // バッジを獲得した場合、DBに保存
      if (badgeEarned) {
        newBadge = await prisma.badge.create({
          data: {
            userId,
            quizId,
            name: badgeName,
            description: badgeDescription,
            imageUrl: badgeImageUrl,
            achievedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(
      {
        quizResult,
        newBadge,
        message: "テスト結果が正常に保存されました",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("テスト結果保存エラー:", error);
    return NextResponse.json(
      { error: "テスト結果の保存中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
