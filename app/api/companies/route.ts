import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
        industry: true,
        location: true,
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("会社情報取得エラー:", error);
    return NextResponse.json(
      { error: "会社情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
