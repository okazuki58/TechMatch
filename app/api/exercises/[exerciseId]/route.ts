import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getExerciseById } from "@/app/lib/exercises";

// GET: 特定の演習を取得
export async function GET(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const exercise = await getExerciseById(params.exerciseId);

    if (!exercise) {
      return NextResponse.json(
        { error: "演習が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("演習取得エラー:", error);
    return NextResponse.json(
      { error: "演習の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// PUT: 演習を更新
export async function PUT(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const data = await request.json();

    // 必須フィールドの検証
    if (!data.title || !data.description || !data.difficulty) {
      return NextResponse.json(
        { error: "タイトル、説明文、難易度は必須です" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.update({
      where: { id: params.exerciseId },
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        gifUrl: data.gifUrl || null,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Failed to update exercise:", error);
    return NextResponse.json(
      { error: "演習の更新に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: 演習を削除
export async function DELETE(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    await prisma.exercise.delete({
      where: { id: params.exerciseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    return NextResponse.json(
      { error: "演習の削除に失敗しました" },
      { status: 500 }
    );
  }
}
