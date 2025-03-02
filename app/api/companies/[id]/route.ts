import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        jobs: {
          where: {
            isActive: true,
          },
          orderBy: {
            postedAt: "desc",
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "企業が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("企業情報の取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "企業情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
