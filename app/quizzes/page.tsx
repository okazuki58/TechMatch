"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import { quizCategories } from "@/app/lib/data";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { quizzes } from "../lib/quizzes";

export default function QuizzesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  // フィルタリング
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = selectedCategory
      ? quiz.category === selectedCategory
      : true;
    const matchesSearch =
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">テスト一覧</h1>

        {/* 検索とフィルタ */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative md:flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="テストを検索..."
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              すべて
            </button>

            {quizCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* テストカード */}
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
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {quiz.category}
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
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

                  {hasBadge && (
                    <div className="flex items-center mb-4 bg-green-50 p-2 rounded">
                      <svg
                        className="w-5 h-5 text-green-600 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-sm text-green-700 font-medium">
                        バッジ獲得済み: {quiz.badge.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="w-full inline-flex justify-center btn btn-primary"
                  >
                    {hasCompleted ? "再挑戦する" : "チャレンジする"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? `"${searchTerm}" に一致するテストが見つかりませんでした。`
                : "選択したカテゴリのテストはありません。"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              className="btn btn-secondary"
            >
              すべて表示
            </button>
          </div>
        )}
      </div>
    </>
  );
}
