"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { getExerciseById, getTestResults } from "@/app/lib/exercises";
import { Exercise, TestResult } from "@/app/lib/definitions";
import Navbar from "@/app/ui/navbar";
import TestResults from "@/app/ui/exercise/test-results";

export default function ExerciseResultsPage({
  params,
}: {
  params: { exerciseId: string };
}) {
  const { exerciseId } = params;
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const { user } = useAuth();

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

        // テスト結果を取得
        const resultData = await getTestResults(submissionId);
        setTestResult(resultData);
        setIsLoading(false);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError("テスト結果の取得に失敗しました");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, submissionId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-6">テスト結果を取得中...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="mt-4 text-gray-600">
              テスト結果の取得には数分かかる場合があります。しばらくお待ちください。
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !exercise) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-6">エラーが発生しました</h1>
            <p className="text-red-600 mb-6">
              {error || "演習が見つかりません"}
            </p>
            <Link
              href={`/exercises/${exerciseId}`}
              className="text-blue-600 hover:underline"
            >
              演習ページに戻る
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href={`/exercises/${exerciseId}`}
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            演習ページに戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
            <p className="text-gray-600 mb-6">テスト結果</p>

            {testResult ? (
              <TestResults result={testResult} />
            ) : (
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <p className="text-yellow-700">
                  テスト結果がまだ利用できません。しばらく経ってからもう一度お試しください。
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link
                  href={`/exercises/${exerciseId}`}
                  className="text-blue-600 hover:underline"
                >
                  演習に戻る
                </Link>
                <Link
                  href="/exercises"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                >
                  他の演習を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
