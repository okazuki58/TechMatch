"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Exercise } from "@/app/lib/definitions";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch("/api/exercises");
        if (!response.ok) {
          throw new Error("演習の取得に失敗しました");
        }
        const data = await response.json();
        setExercises(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        setError(
          error instanceof Error ? error.message : "演習の取得に失敗しました"
        );
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("この演習を削除してもよろしいですか？")) return;

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("演習の削除に失敗しました");
      }

      setExercises(exercises.filter((exercise) => exercise.id !== id));
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      alert(
        error instanceof Error ? error.message : "演習の削除に失敗しました"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">演習管理</h1>
        <div className="flex justify-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">演習管理</h1>
        <div className="bg-red-100 p-4 rounded text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">演習管理</h1>
        <Link
          href="/admin/exercises/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">
            演習がまだありません。「新規作成」から追加してください。
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  難易度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GIF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {exercise.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        exercise.difficulty === "beginner"
                          ? "bg-green-100 text-green-800"
                          : exercise.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exercise.gifUrl ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exercise.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/exercises/${exercise.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/admin/exercises/${exercise.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
