import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const experienceLevel = searchParams.get("experienceLevel");
    const employmentType = searchParams.get("employmentType");

    // 検索条件を構築
    const whereClause: Prisma.JobWhereInput = { isActive: true };

    if (companyId) whereClause.companyId = companyId;
    if (experienceLevel) whereClause.experienceLevel = experienceLevel;
    if (employmentType) whereClause.employmentType = employmentType;

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { postedAt: "desc" },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("求人情報取得エラー:", error);
    return NextResponse.json(
      { error: "求人情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
