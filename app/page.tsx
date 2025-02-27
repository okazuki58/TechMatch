"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Link from "next/link";
import { quizzes } from "@/app/lib/quizzes";
export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            クイズマスターへようこそ！
          </h1>
          <p className="text-gray-600 mb-6">
            様々なカテゴリのクイズに挑戦して、知識を試してみましょう。
            バッジを集めて、友達とスコアを競い合おう！
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/quizzes")}
              className="btn btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              クイズを探す
            </button>

            <Link
              href="/login"
              className="btn btn-outline px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              ログイン
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-3">人気のクイズ</h2>
            <ul className="space-y-3">
              {quizzes.slice(0, 3).map((quiz) => (
                <li key={quiz.id} className="border-b pb-2">
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {quiz.name}
                  </Link>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-3">クイズマスターの特徴</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>様々なカテゴリの問題</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>獲得可能なバッジシステム</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>スコア記録と友達との共有</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>難易度別のチャレンジ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
