"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import { quizCategories } from "@/app/lib/data";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { Quiz } from "@/app/lib/definitions";

export default function QuizzesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // クイズデータの取得
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch("/api/quizzes");
        if (!response.ok) {
          throw new Error("クイズの取得に失敗しました");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("クイズの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  // フィルタリング
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = selectedCategory
      ? quiz.category === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
  // ローディング中の表示
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">スキルテスト一覧</h1>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="テストを検索..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              すべて
            </button>
            {quizCategories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            // ユーザーがログインしている場合、バッジ獲得済みかチェック
            const hasBadge =
              user?.badges?.some((badge) => badge.quizId === quiz.id) || false;

            // ユーザーがこのテストを完了したことがあるかチェック
            const hasCompleted =
              user?.quizResults?.some((result) => result.quizId === quiz.id) ||
              false;

            // 最高スコアを計算
            const bestResult = user?.quizResults
              ? user.quizResults
                  .filter((result) => result.quizId === quiz.id)
                  .sort((a, b) => b.score - a.score)[0]
              : null;

            const bestScore = bestResult
              ? Math.round((bestResult.score / bestResult.maxScore) * 100)
              : null;

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {quiz.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {quiz.difficulty === "easy" && "初級"}
                      {quiz.difficulty === "medium" && "中級"}
                      {quiz.difficulty === "hard" && "上級"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{quiz.name}</h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      問題数: {quiz.questions.length}問
                    </span>

                    {bestScore !== null && (
                      <span className="text-sm font-medium">
                        最高スコア:{" "}
                        <span className="text-blue-600">{bestScore}%</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between">
                    {hasBadge && (
                      <div className="flex items-center">
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          バッジ獲得済み
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className={`px-4 py-2 rounded-lg text-center ${
                        hasCompleted
                          ? "bg-blue-50 text-blue-700"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {hasCompleted ? "再挑戦する" : "挑戦する"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              条件に一致するテストが見つかりませんでした。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
