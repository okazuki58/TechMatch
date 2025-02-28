// app/dashboard/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import BadgeCollection from "@/app/ui/badge-collection";
import Link from "next/link";

// 代替の要素のためのローディング状態のコンポーネント
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded mb-4"></div>
    <div className="h-64 bg-gray-200 rounded mb-4"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // ユーザーがログインしていない場合はログインページにリダイレクト
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // ローディング中または未ログイン時の表示
  if (isLoading || !user) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* 統計カード */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              テスト統計
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">完了したテスト</span>
              <span className="font-medium">{user.quizResults.length}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">獲得バッジ</span>
              <span className="font-medium">{user.badges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均スコア</span>
              <span className="font-medium">
                {user.quizResults.length > 0
                  ? Math.round(
                      user.quizResults.reduce(
                        (acc, result) =>
                          acc + (result.score / result.maxScore) * 100,
                        0
                      ) / user.quizResults.length
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* 最近のアクティビティ */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              最近の活動
            </h2>
            {user.quizResults.length > 0 ? (
              <div className="space-y-3">
                {user.quizResults
                  .sort(
                    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
                  )
                  .slice(0, 3)
                  .map((result) => (
                    <div
                      key={result.id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span className="text-gray-600">{result.quizName}</span>
                      <span className="font-medium">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">まだテストに挑戦していません</p>
            )}
          </div>

          {/* おすすめのテスト */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              おすすめのテスト
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">一般教養テスト</span>
                <Link
                  href="/quizzes/quiz-001"
                  className="text-sm text-blue-600 hover:underline"
                >
                  挑戦する
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">テックマスターテスト</span>
                <Link
                  href="/quizzes/quiz-002"
                  className="text-sm text-blue-600 hover:underline"
                >
                  挑戦する
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* バッジセクション */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">獲得したバッジ</h2>
            <Link href="/badges" className="text-blue-600 hover:underline">
              すべて見る
            </Link>
          </div>
          <BadgeCollection badges={user.badges} />
        </div>

        {/* テスト履歴 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">テスト履歴</h2>
          {user.quizResults.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      テスト名
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      スコア
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      完了日
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.quizResults
                    .sort(
                      (a, b) =>
                        b.completedAt.getTime() - a.completedAt.getTime()
                    )
                    .map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.quizName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.score} / {result.maxScore} (
                          {Math.round((result.score / result.maxScore) * 100)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.completedAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/quizzes/${result.quizId}`}
                            className="text-blue-600 hover:underline"
                          >
                            再挑戦
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-4">
                まだテストに挑戦していません。
              </p>
              <Link href="/quizzes" className="inline-block btn btn-primary">
                テストに挑戦する
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
