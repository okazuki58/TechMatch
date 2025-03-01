"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Question, Quiz } from "@prisma/client";

interface QuizWithCount extends Quiz {
  _count?: { questions: number };
  questions?: Question[];
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch("/api/admin/quizzes");
        if (!response.ok) {
          throw new Error("クイズの取得に失敗しました");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("クイズの取得エラー:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      try {
        const response = await fetch(`/api/admin/quizzes/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setQuizzes(quizzes.filter((quiz: Quiz) => quiz.id !== id));
        } else {
          alert("削除に失敗しました");
        }
      } catch (error) {
        console.error(error);
        alert("エラーが発生しました");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">クイズ管理</h1>
        <Link
          href="/admin/quizzes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          新規クイズ作成
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名前
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                難易度
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                問題数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.length > 0 ? (
              quizzes.map((quiz: QuizWithCount) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quiz.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.difficulty === "easy"
                      ? "初級"
                      : quiz.difficulty === "medium"
                      ? "中級"
                      : "上級"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.questions?.length || 0}問
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/admin/quizzes/${quiz.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  クイズがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
