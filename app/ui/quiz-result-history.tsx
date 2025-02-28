import React from "react";
import Link from "next/link";
import { QuizResult } from "@/app/lib/definitions";

interface QuizResultHistoryProps {
  results: QuizResult[];
}

export default function QuizResultHistory({ results }: QuizResultHistoryProps) {
  // 結果を日付の新しい順にソート
  const sortedResults = [...results].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">
          まだテスト結果がありません。テストに挑戦してみましょう！
        </p>
        <Link
          href="/quizzes"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          テストを探す
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
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
                達成率
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
            {sortedResults.map((result) => {
              const percentage = Math.round(
                (result.score / result.maxScore) * 100
              );
              let statusColor = "bg-red-100 text-red-800";

              if (percentage >= 80) {
                statusColor = "bg-green-100 text-green-800";
              } else if (percentage >= 60) {
                statusColor = "bg-blue-100 text-blue-800";
              } else if (percentage >= 40) {
                statusColor = "bg-yellow-100 text-yellow-800";
              }

              return (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.quizName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.score} / {result.maxScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                    >
                      {percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/quizzes/${result.quizId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      再挑戦
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
