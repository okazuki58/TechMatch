import { NextRequest, NextResponse } from "next/server";
import { getQuizById } from "@/app/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await getQuizById(params.id);

    if (!quiz) {
      return NextResponse.json(
        { error: "クイズが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("クイズの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "クイズの取得に失敗しました" },
      { status: 500 }
    );
  }
}
