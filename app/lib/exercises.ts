import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { ExerciseSubmission, TestResult } from "./definitions";

// DBから演習一覧を取得する関数
export async function getExercises() {
  return prisma.exercise.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// 特定の演習とその説明文を取得する関数
export async function getExerciseById(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise) return null;

  // マークダウンファイルから説明文を読み込む
  const instructions = await getExerciseInstructions(id);

  return {
    ...exercise,
    instructions,
  };
}

// マークダウンファイルから説明文を読み込む関数
export async function getExerciseInstructions(id: string): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "app/content/exercises",
    `${id}.md`
  );

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent;
  } catch (error) {
    console.error(`Failed to read exercise instructions for ${id}:`, error);
    return "";
  }
}

// クライアントサイドから呼び出すAPI関数
export async function submitExercise(
  userId: string,
  exerciseId: string,
  repositoryUrl: string
): Promise<ExerciseSubmission> {
  const response = await fetch("/api/exercises/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      exerciseId,
      repositoryUrl,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "リポジトリの提出に失敗しました");
  }

  const data = await response.json();
  return data.submission;
}

// テスト結果を取得する関数
export async function getTestResults(
  submissionId: string
): Promise<TestResult | null> {
  const response = await fetch(
    `/api/exercises/results?submissionId=${submissionId}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.result;
}
