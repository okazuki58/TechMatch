"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Exercise } from "@/app/lib/definitions";

export default function ExerciseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await fetch(`/api/exercises/${id}`);

        if (!response.ok) {
          throw new Error("演習の取得に失敗しました");
        }

        const data = await response.json();
        setExercise(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
        setError(
          error instanceof Error ? error.message : "演習の取得に失敗しました"
        );
        setLoading(false);
      }
    }

    fetchExercise();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("この演習を削除してもよろしいですか？")) return;

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("演習の削除に失敗しました");
      }

      router.push("/admin/exercises");
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
        <h1 className="text-2xl font-bold mb-6">演習詳細</h1>
        <div className="flex justify-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">演習詳細</h1>
        <div className="bg-red-100 p-4 rounded text-red-700">
          <p>{error || "演習が見つかりませんでした"}</p>
        </div>
        <div className="mt-4">
          <Link
            href="/admin/exercises"
            className="text-blue-600 hover:text-blue-800"
          >
            ← 一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">演習詳細: {exercise.title}</h1>
        <Link
          href="/admin/exercises"
          className="text-gray-600 hover:text-gray-900"
        >
          ← 一覧に戻る
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-2">{exercise.title}</h2>
              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium 
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
              </div>
              <div className="prose max-w-none">
                <p>{exercise.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">GIF プレビュー</h3>
              {exercise.gifUrl ? (
                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src={exercise.gifUrl}
                    alt={`${exercise.title}のGIF`}
                    width={300}
                    height={200}
                    className="w-full h-auto"
                    unoptimized={!exercise.gifUrl.startsWith("/")}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4 text-center text-gray-500 bg-gray-50">
                  GIFが設定されていません
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-6 flex justify-between">
          <div className="text-sm text-gray-500">
            <p>作成日: {new Date(exercise.createdAt).toLocaleDateString()}</p>
            <p>更新日: {new Date(exercise.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/exercises/${exercise.id}/edit`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              編集
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
