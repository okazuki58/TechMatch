"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditExercisePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    gifUrl: "",
  });

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await fetch(`/api/exercises/${id}`);

        if (!response.ok) {
          throw new Error("演習の取得に失敗しました");
        }

        const exercise = await response.json();
        setFormData({
          title: exercise.title || "",
          description: exercise.description || "",
          difficulty: exercise.difficulty || "beginner",
          gifUrl: exercise.gifUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
        setError(
          error instanceof Error ? error.message : "演習の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("演習の更新に失敗しました");
      }

      router.push(`/admin/exercises/${id}`);
    } catch (error) {
      console.error("Failed to update exercise:", error);
      setError(
        error instanceof Error ? error.message : "演習の更新に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">演習編集</h1>
        <div className="flex justify-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">演習編集</h1>
        <Link
          href={`/admin/exercises/${id}`}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 詳細に戻る
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              タイトル*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              説明文*
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700"
            >
              難易度*
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              value={formData.difficulty}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="gifUrl"
              className="block text-sm font-medium text-gray-700"
            >
              GIF URL
            </label>
            <input
              type="url"
              id="gifUrl"
              name="gifUrl"
              value={formData.gifUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/exercise.gif"
            />
            <p className="mt-1 text-sm text-gray-500">
              演習の説明に使用するGIFのURL（オプション）
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "送信中..." : "更新する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
