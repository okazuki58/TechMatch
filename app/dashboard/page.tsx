"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/contexts/auth-context";
import Navbar from "@/app/ui/navbar";
import QuizResultHistory from "@/app/ui/quiz-result-history";
import BadgeCollection from "@/app/ui/badge-collection";
import Link from "next/link";
import { Badge, QuizResult, ExerciseSubmission } from "@/app/lib/definitions";

export default function DashboardPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const isLoading = status === "loading";
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [exerciseSubmissions, setExerciseSubmissions] = useState<
    ExerciseSubmission[]
  >([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ユーザーがログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ユーザーがログインしたらデータをフェッチ
  useEffect(() => {
    if (user) {
      // ユーザーのクイズ結果とバッジを取得
      fetch("/api/user/stats", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setQuizResults(data.quizResults || []);
          setBadges(data.badges || []);
          setExerciseSubmissions(data.exerciseSubmissions || []);
          console.log(data.exerciseSubmissions);
          setIsDataLoading(false);
        })
        .catch((err) => {
          console.error("データ取得エラー:", err);
          setIsDataLoading(false);
        });
    }
  }, [user]);

  if (isLoading || isDataLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">読み込み中...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return null; // リダイレクト中は何も表示しない
  }

  // バッジの数を取得
  const badgeCount = badges.length;
  // クイズ結果の数を取得
  const quizResultCount = quizResults.length;
  // 完了した演習の数を取得
  const completedExercises = exerciseSubmissions.filter(
    (submission) => submission.status === "completed"
  ).length;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            ようこそ、{user.name || "ユーザー"}さん
          </h2>
          <p className="text-gray-600">
            DevExamでプログラミングスキルを磨きましょう。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">最近のテスト</h3>
            {quizResultCount > 0 ? (
              <div className="space-y-3">
                {quizResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.quizName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">
                        スコア: {result.score}/{result.maxScore}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
                <Link
                  href="#quiz-history"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-2"
                >
                  すべての結果を見る
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-500">
                  まだテストに取り組んでいません。
                </p>
                <Link
                  href="/quizzes"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
                >
                  テストを探す
                </Link>
              </>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">あなたの統計</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">完了したテスト:</span>
                <span className="font-medium">{quizResultCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">完了した演習:</span>
                <span className="font-medium">{completedExercises}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">獲得したバッジ:</span>
                <span className="font-medium">{badgeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ランキング:</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>
        </div>

        {badgeCount > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">獲得バッジ</h2>
              <Link
                href="/badges"
                className="text-blue-600 hover:text-blue-800"
              >
                すべて見る
              </Link>
            </div>
            <BadgeCollection
              badges={badges}
              emptyMessage="まだバッジを獲得していません。テストに挑戦してバッジを集めましょう！"
            />
          </div>
        )}

        <div id="quiz-history" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">テスト結果履歴</h2>
            <Link href="/quizzes" className="text-blue-600 hover:text-blue-800">
              テストを探す
            </Link>
          </div>
          <QuizResultHistory results={quizResults} />
        </div>

        {/* 演習結果セクション */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">演習提出履歴</h2>
            <Link
              href="/exercises"
              className="text-blue-600 hover:text-blue-800"
            >
              演習を探す
            </Link>
          </div>

          {exerciseSubmissions.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      演習ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      提出日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      点数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      リポジトリ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exerciseSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.exerciseId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            submission.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : submission.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {submission.status === "completed"
                            ? "完了"
                            : submission.status === "pending"
                            ? "評価中"
                            : "失敗"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.results
                          ? (() => {
                              try {
                                // resultsが文字列ならパース、オブジェクトならそのまま使用
                                const result =
                                  typeof submission.results === "string"
                                    ? JSON.parse(submission.results)
                                    : submission.results;
                                return result.score ? `${result.score}点` : "-";
                              } catch {
                                return "-";
                              }
                            })()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <a
                          href={submission.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          リポジトリ
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">まだ演習に取り組んでいません。</p>
              <Link
                href="/exercises"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
              >
                演習を探す
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
