import { NextResponse } from "next/server";
import { getQuizzes } from "@/app/lib/data";

export async function GET() {
  try {
    const quizzes = await getQuizzes();
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("クイズの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "クイズの取得に失敗しました" },
      { status: 500 }
    );
  }
}
