import { prisma } from "@/app/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // 基本的な統計情報を取得
  const quizCount = await prisma.quiz.count();
  const userCount = await prisma.user.count();
  const quizResultCount = await prisma.quizResult.count();
  const badgeCount = await prisma.badge.count();

  // 最近のクイズ結果を取得
  const recentResults = await prisma.quizResult.findMany({
    take: 5,
    orderBy: {
      completedAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      quiz: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">クイズ数</h2>
          <p className="text-3xl font-bold mt-2">{quizCount}</p>
          <Link
            href="/admin/quizzes"
            className="text-blue-600 text-sm mt-4 block"
          >
            クイズを管理 →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">ユーザー数</h2>
          <p className="text-3xl font-bold mt-2">{userCount}</p>
          <Link
            href="/admin/users"
            className="text-blue-600 text-sm mt-4 block"
          >
            ユーザーを管理 →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">クイズ受験回数</h2>
          <p className="text-3xl font-bold mt-2">{quizResultCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium">獲得バッジ数</h2>
          <p className="text-3xl font-bold mt-2">{badgeCount}</p>
        </div>
      </div>

      {/* 最近のクイズ結果 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">最近のクイズ結果</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  クイズ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  スコア
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  日時
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.user.name || result.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.quiz.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.score}/{result.maxScore} (
                    {Math.round((result.score / result.maxScore) * 100)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(result.completedAt).toLocaleString("ja-JP")}
                  </td>
                </tr>
              ))}
              {recentResults.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
