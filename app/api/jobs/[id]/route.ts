import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "求人が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("求人情報の取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "求人情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
