"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/contexts/auth-context";
import Navbar from "@/app/ui/navbar";
import QuizResultHistory from "@/app/ui/quiz-result-history";
import Link from "next/link";
import { Badge, QuizResult, ExerciseSubmission } from "@/app/lib/definitions";
import Image from "next/image";

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">
              ようこそ、{user.name || "ユーザー"}さん
            </h1>
            <p className="text-blue-100 text-lg">
              DevExamでスキルを証明し、キャリアを次のレベルへ
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg flex items-center">
                <div className="p-3 bg-blue-500 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-100">完了したテスト</p>
                  <p className="text-2xl font-bold">{quizResultCount}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg flex items-center">
                <div className="p-3 bg-indigo-500 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-100">完了した演習</p>
                  <p className="text-2xl font-bold">{completedExercises}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg flex items-center">
                <div className="p-3 bg-purple-500 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-100">獲得したバッジ</p>
                  <p className="text-2xl font-bold">{badgeCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  スキルプログレス
                </h2>
              </div>

              {quizResults.length > 0 ? (
                <div className="space-y-4 flex-grow">
                  {/* スキルグラフの例（実際にはデータに基づいて動的に生成） */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        アルゴリズム
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        85%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        データベース
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        70%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        フロントエンド開発
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        92%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    <Link
                      href="/skills"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      スキル詳細を見る
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 flex-grow flex flex-col justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-4">
                    まだテストに取り組んでいません。
                    <br />
                    スキルを証明するためにテストを受けましょう。
                  </p>
                  <Link
                    href="/quizzes"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    テストを探す
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-full flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                最近のアクティビティ
              </h3>

              {quizResults.length > 0 ? (
                <div className="space-y-4 flex-grow flex flex-col">
                  {quizResults.slice(0, 3).map((result) => (
                    <div
                      key={result.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800 truncate">
                              {result.quizName}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(
                                result.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${Math.round(
                                      (result.score / result.maxScore) * 100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-blue-600">
                              {Math.round(
                                (result.score / result.maxScore) * 100
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Link
                    href="#quiz-history"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center mt-auto font-medium"
                  >
                    すべての結果を見る
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4 flex-grow flex flex-col justify-center">
                  <p className="text-gray-500">
                    アクティビティはまだありません
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {badgeCount > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                獲得バッジ
              </h2>
              <Link
                href="/badges"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                すべて見る
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 flex flex-col items-center h-full shadow-sm"
                  >
                    {/* バッジアイコン - 適切なサイズに調整 */}
                    <div className="mb-3 relative">
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-full"></div>
                      <Image
                        src={badge.imageUrl}
                        alt={badge.name}
                        width={80}
                        height={80}
                        className="object-contain hover:scale-110 transition-transform rounded-full bg-white p-1 relative z-10 shadow-sm"
                      />
                    </div>

                    {/* タイトル - 固定高さと行数制限 */}
                    <h3 className="text-sm font-bold text-gray-800 text-center mb-1 line-clamp-2 h-10 flex items-center justify-center">
                      {badge.name}
                    </h3>

                    {/* 獲得日 - より洗練されたデザイン */}
                    <div className="mt-auto pt-2 w-full">
                      <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block w-full text-center">
                        {new Date(badge.achievedAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div id="quiz-history" className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              テスト結果履歴
            </h2>
            <Link
              href="/quizzes"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              テストを探す
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <QuizResultHistory results={quizResults} />
          </div>
        </div>

        {/* 演習結果セクション */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              演習提出履歴
            </h2>
            <Link
              href="/exercises"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              演習を探す
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {exerciseSubmissions.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
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
                      <tr
                        key={submission.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.exerciseId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                                  const result =
                                    typeof submission.results === "string"
                                      ? JSON.parse(submission.results)
                                      : submission.results;
                                  return result.score
                                    ? `${result.score}点`
                                    : "-";
                                } catch {
                                  return "-";
                                }
                              })()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={submission.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                          >
                            リポジトリ
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <p className="text-gray-500 mb-6">
                まだ演習に取り組んでいません。
                <br />
                実践的なプログラミングスキルを証明しましょう。
              </p>
              <Link
                href="/exercises"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md inline-flex items-center"
              >
                演習を探す
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
