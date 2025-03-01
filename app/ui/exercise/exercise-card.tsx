import Link from "next/link";
import { Exercise } from "@/app/lib/definitions";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  // 難易度に応じたバッジの色を設定
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  }[exercise.difficulty];

  // カテゴリの日本語表示
  type CategoryKey =
    | "frontend"
    | "backend"
    | "fullstack"
    | "database"
    | "devops";
  const categoryMap = {
    frontend: "フロントエンド",
    backend: "バックエンド",
    fullstack: "フルスタック",
    database: "データベース",
    devops: "DevOps",
  };
  const categoryDisplay =
    categoryMap[exercise.category as CategoryKey] || exercise.category;

  // 難易度の日本語表示
  const difficultyDisplay = {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  }[exercise.difficulty];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-900">{exercise.title}</h2>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}
          >
            {difficultyDisplay}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{exercise.description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-4">カテゴリ: {categoryDisplay}</span>
          <span>
            作成日: {new Date(exercise.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mb-4">
          {exercise.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/exercises/${exercise.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}
