import { ExerciseSubmission, TestResult } from "./definitions";

// クライアントサイドから呼び出すAPI関数
export async function getExercises() {
  const response = await fetch("/api/exercises");
  if (!response.ok) {
    throw new Error("演習の取得に失敗しました");
  }
  return response.json();
}

export async function getExerciseById(id: string) {
  const response = await fetch(`/api/exercises/${id}`);
  if (!response.ok) {
    throw new Error("演習の取得に失敗しました");
  }
  return response.json();
}

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
