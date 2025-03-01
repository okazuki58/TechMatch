import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserStats } from "@/app/lib/data";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const { quizResults, badges } = await getUserStats(session.user.id);
    return NextResponse.json({ quizResults, badges });
  } catch (error) {
    console.error("ユーザーデータ取得エラー:", error);
    return NextResponse.json(
      { error: "データ取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
