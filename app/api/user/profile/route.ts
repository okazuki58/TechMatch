import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// プロフィール情報を取得
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        bio: true,
        motivation: true,
        githubUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("プロフィール取得エラー:", error);
    return NextResponse.json(
      { error: "プロフィール取得に失敗しました" },
      { status: 500 }
    );
  }
}

// プロフィール情報を更新
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // バリデーション（簡易版）
    const { bio, motivation, githubUrl, twitterUrl, linkedinUrl } = data;

    // URLのバリデーション
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (githubUrl && !urlPattern.test(githubUrl)) {
      return NextResponse.json(
        { error: "GitHubのURLが無効です" },
        { status: 400 }
      );
    }

    if (twitterUrl && !urlPattern.test(twitterUrl)) {
      return NextResponse.json(
        { error: "TwitterのURLが無効です" },
        { status: 400 }
      );
    }

    if (linkedinUrl && !urlPattern.test(linkedinUrl)) {
      return NextResponse.json(
        { error: "LinkedInのURLが無効です" },
        { status: 400 }
      );
    }

    // DB更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        bio,
        motivation,
        githubUrl,
        twitterUrl,
        linkedinUrl,
      },
    });

    return NextResponse.json({
      bio: updatedUser.bio,
      motivation: updatedUser.motivation,
      githubUrl: updatedUser.githubUrl,
      twitterUrl: updatedUser.twitterUrl,
      linkedinUrl: updatedUser.linkedinUrl,
    });
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return NextResponse.json(
      { error: "プロフィール更新に失敗しました" },
      { status: 500 }
    );
  }
}
