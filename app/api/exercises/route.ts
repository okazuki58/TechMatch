import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: 演習一覧を取得
export async function GET() {
  try {
    // パラメータを使わずに全ての演習を取得
    const exercises = await prisma.exercise.findMany({
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("演習一覧取得エラー:", error);
    return NextResponse.json(
      { error: "演習一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
