"use client";

import { useState, useEffect } from "react";
import { Exercise } from "@/app/lib/definitions";
import { getExercises } from "@/app/lib/client-exercises";
import ExerciseCard from "@/app/ui/exercise/exercise-card";
import Navbar from "@/app/ui/navbar";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [filters, setFilters] = useState({
    difficulty: "",
    category: "",
    searchTerm: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
        setFilteredExercises(data);
        setIsLoading(false);
      } catch (error) {
        console.error("演習の取得に失敗しました:", error);
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    // フィルター適用
    let result = [...exercises];

    if (filters.difficulty) {
      result = result.filter((ex) => ex.difficulty === filters.difficulty);
    }

    if (filters.category) {
      result = result.filter((ex) => ex.category === filters.category);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.title.toLowerCase().includes(term) ||
          ex.description.toLowerCase().includes(term) ||
          ex.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    setFilteredExercises(result);
  }, [filters, exercises]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      difficulty: "",
      category: "",
      searchTerm: "",
    });
  };

  // カテゴリの一覧を取得
  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">プログラミング演習</h1>

        {/* フィルターセクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                難易度
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                <option value="">すべての難易度</option>
                <option value="beginner">初級</option>
                <option value="intermediate">中級</option>
                <option value="advanced">上級</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                カテゴリ
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                <option value="">すべてのカテゴリ</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "frontend"
                      ? "フロントエンド"
                      : category === "backend"
                      ? "バックエンド"
                      : category === "fullstack"
                      ? "フルスタック"
                      : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                検索
              </label>
              <input
                type="text"
                id="search"
                placeholder="キーワードで検索..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              フィルターをリセット
            </button>
          </div>
        </div>

        {/* 演習一覧 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              条件に一致する演習が見つかりませんでした。
            </p>
            <p className="text-gray-500 mt-2">
              検索条件を変更してお試しください。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
