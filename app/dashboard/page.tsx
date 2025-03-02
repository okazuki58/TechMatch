"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/contexts/auth-context";
import Navbar from "@/app/ui/navbar";
import QuizResultHistory from "@/app/ui/quiz-result-history";
import Link from "next/link";
import { Badge, QuizResult, ExerciseSubmission } from "@/app/lib/definitions";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const isLoading = status === "loading";
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [exerciseSubmissions, setExerciseSubmissions] = useState<
    ExerciseSubmission[]
  >([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
    motivation: "",
    githubUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
  });

  // ユーザーがログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ユーザーがログインしたらデータをフェッチ
  useEffect(() => {
    if (user) {
      // ユーザーのクイズ結果、バッジ、演習提出を取得
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
          setIsDataLoading(false);
        })
        .catch((err) => {
          console.error("データ取得エラー:", err);
          setIsDataLoading(false);
        });

      // プロフィールデータを取得（APIはまだ存在しないと仮定して、仮のデータをセット）
      // 後でAPIができたら以下のコメントを外す
      /*
      fetch("/api/user/profile", {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data);
        })
        .catch((err) => {
          console.error("プロフィール取得エラー:", err);
        });
      */
    }
  }, [user]);

  const handleProfileUpdate = () => {
    // プロフィール更新処理（実装予定）
    setIsEditing(false);
    // fetch("/api/user/profile", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(profileData),
    // })
  };

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
        {/* プロフィールヘッダー部分 */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* プロフィール画像 */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "ユーザー"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>

                {/* 編集ボタン - 自分のプロフィールの場合のみ表示 */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-white text-blue-600 p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              {/* ユーザー情報 */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">
                  {user.name || "ユーザー"}
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  {user.email} {/* または役職・タイトル */}
                </p>

                {/* SNSリンク */}
                <div className="flex gap-3">
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {profileData.twitterUrl && (
                    <a
                      href={profileData.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                  )}
                  {profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* スキル証明の概要 */}
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
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
                    <p className="text-sm text-blue-100">合格したテスト</p>
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
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
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
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
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
        </div>

        {/* 自己紹介・志望動機セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* 自己紹介 */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                自己紹介
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  編集
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {isEditing ? (
              <div>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
                  placeholder="あなたのスキルや経験、目標などを入力してください"
                />
              </div>
            ) : (
              <div className="prose">
                {profileData.bio ? (
                  <p>{profileData.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    自己紹介はまだ設定されていません。編集ボタンから追加しましょう！
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 志望動機 */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                志望動機・キャリア目標
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  編集
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {isEditing ? (
              <div>
                <textarea
                  value={profileData.motivation}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      motivation: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
                  placeholder="あなたの志望動機やキャリア目標について入力してください"
                />
              </div>
            ) : (
              <div className="prose">
                {profileData.motivation ? (
                  <p>{profileData.motivation}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    志望動機やキャリア目標はまだ設定されていません。編集ボタンから追加しましょう！
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 編集モード時の保存/キャンセルボタン */}
        {isEditing && (
          <div className="flex justify-end gap-4 mb-10">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleProfileUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              保存する
            </button>
          </div>
        )}

        {/* 証明済みスキル (バッジセクション) */}
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
                証明済みスキル
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
                    className="bg-white hover:bg-gray-50 transition rounded-lg p-4 flex flex-col items-center h-full shadow-sm border border-gray-100"
                  >
                    {/* バッジアイコン */}
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

                    {/* タイトル */}
                    <h3 className="text-sm font-bold text-gray-800 text-center mb-1 line-clamp-2 h-10 flex items-center justify-center">
                      {badge.name}
                    </h3>

                    {/* 合格バッジ追加 */}
                    <div className="my-1">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        合格
                      </span>
                    </div>

                    {/* 獲得日 */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* 合格したテストの詳細 */}
          <div>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  合格したテスト
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

              {quizResults.length > 0 ? (
                <div className="space-y-4 flex-grow flex flex-col">
                  {quizResults.slice(0, 3).map((result) => (
                    <div
                      key={result.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3 flex-shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:justify-between">
                            <span className="font-medium text-gray-800 truncate max-w-[180px]">
                              {result.quizName}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 xs:mt-0 xs:ml-2 flex-shrink-0">
                              {new Date(
                                result.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-2">
                                合格
                              </span>
                              <span className="text-xs text-gray-600">
                                {result.score}/{result.maxScore}点
                              </span>
                            </div>
                            <span className="text-xs font-medium text-blue-600 flex-shrink-0">
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
                    すべてのテスト結果を見る
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
                  <p className="text-gray-500">まだテストを受けていません</p>
                  <Link
                    href="/quizzes"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    テストに挑戦する
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 演習提出の詳細 */}
          <div>
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  完了した演習
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
                <div className="space-y-4 flex-grow flex flex-col">
                  {exerciseSubmissions.slice(0, 3).map((submission) => (
                    <div
                      key={submission.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                            submission.status === "completed"
                              ? "bg-green-100"
                              : submission.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              submission.status === "completed"
                                ? "text-green-600"
                                : submission.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {submission.status === "completed" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : submission.status === "pending" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:justify-between">
                            <span className="font-medium text-gray-800 truncate max-w-[180px]">
                              {`演習 ${submission.id.substring(0, 4)}`}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 xs:mt-0 xs:ml-2 flex-shrink-0">
                              {new Date(
                                submission.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full mr-2 ${
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
                                  : "未完了"}
                              </span>

                              {submission.status === "completed" && (
                                <span className="text-xs text-gray-600">
                                  {(() => {
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
                                  })()}
                                </span>
                              )}
                            </div>

                            {submission.repositoryUrl && (
                              <a
                                href={submission.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                              >
                                リポジトリを見る
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 ml-1"
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Link
                    href="#exercise-submissions"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center mt-auto font-medium"
                  >
                    すべての演習結果を見る
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
                  <p className="text-gray-500">まだ演習に取り組んでいません</p>
                  <Link
                    href="/exercises"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    演習に挑戦する
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* テスト結果履歴 */}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              テスト結果履歴
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            {quizResults.length > 0 ? (
              <QuizResultHistory results={quizResults} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">テスト結果がありません</p>
              </div>
            )}
          </div>
        </div>

        {/* 演習提出履歴 */}
        <div id="exercise-submissions" className="mb-10">
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
          </div>

          {exerciseSubmissions.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        演習名
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        提出日
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        状態
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        評価
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        リポジトリ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exerciseSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {`演習 ${submission.id.substring(0, 4)}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(
                              submission.createdAt
                            ).toLocaleDateString()}
                          </div>
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
                          {submission.repositoryUrl && (
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
                          )}
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
