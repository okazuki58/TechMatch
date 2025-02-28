"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Link from "next/link";
import { quizzes } from "@/app/lib/quizzes";
import { useAuth } from "@/app/lib/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth(); // 認証状態を取得

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">DevExamへようこそ！</h1>
          <p className="text-gray-600 mb-6">
            様々なカテゴリのテストに挑戦して、知識を試してみましょう。
            バッジを集めて、友達とスコアを競い合おう！
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/quizzes")}
              className="btn btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              テストを探す
            </button>

            {!user ? (
              <Link
                href="/login"
                className="btn btn-outline px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                ログイン
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="btn btn-outline px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                マイダッシュボード
              </Link>
            )}
          </div>
        </div>

        {/* 残りのコードは変更なし */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* ... */}
        </div>
      </div>
    </>
  );
}
