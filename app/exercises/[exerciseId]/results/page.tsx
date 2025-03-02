"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getExerciseById, getTestResults } from "@/app/lib/client-exercises";
import { Exercise, TestResult } from "@/app/lib/definitions";
import Navbar from "@/app/ui/navbar";
import TestResults from "@/app/ui/exercise/test-results";
import LoadingSpinner from "@/app/ui/laoding-spinner";

export default function ExerciseResultsPage({
  params,
}: {
  params: { exerciseId: string };
}) {
  const { exerciseId } = params;
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!submissionId) {
        setError("提出IDが見つかりません");
        setIsLoading(false);
        return;
      }

      try {
        // 演習情報を取得
        const exerciseData = await getExerciseById(exerciseId);
        setExercise(exerciseData);

        // テスト結果をポーリングで取得
        const pollResults = async () => {
          const resultData = await getTestResults(submissionId);

          if (!resultData) {
            setError("テスト結果の取得に失敗しました");
            setIsLoading(false);
            return;
          }

          // テスト実行中の場合は再度ポーリング
          if (
            resultData.status === "testing" ||
            resultData.status === "pending"
          ) {
            setTimeout(pollResults, 2000); // 2秒ごとにポーリング
          } else {
            setTestResult(resultData);
            setIsLoading(false);
          }
        };

        pollResults();
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError("テスト結果の取得に失敗しました");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, submissionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
            <p className="mt-4 text-lg">テスト結果を取得中です...</p>
            <p className="text-sm text-gray-500">
              テストの実行には数分かかる場合があります
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <Link
              href={`/exercises/${exerciseId}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              演習ページに戻る
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link
                href={`/exercises/${exerciseId}`}
                className="text-blue-600 hover:underline"
              >
                ← 演習ページに戻る
              </Link>
              <h1 className="text-3xl font-bold mt-4">
                {exercise?.title} - 結果
              </h1>
            </div>

            {testResult && <TestResults result={testResult} />}
          </>
        )}
      </main>
    </div>
  );
}
