import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const exerciseId = formData.get("exerciseId") as string;

    if (!file || !exerciseId) {
      return NextResponse.json(
        { error: "ファイルまたはエクササイズIDが不足しています" },
        { status: 400 }
      );
    }

    // ファイル名を設定
    const fileName = `exercise-${exerciseId}-${Date.now()}.gif`;

    // ディレクトリを確実に作成
    const uploadDir = join(process.cwd(), "public", "images", "exercises");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, fileName);

    // ファイルを保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 公開URL
    const fileUrl = `/images/exercises/${fileName}`;

    return NextResponse.json({
      fileUrl,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "ファイルのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
