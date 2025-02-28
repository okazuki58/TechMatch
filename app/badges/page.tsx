"use client";

import React from "react";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Badge from "@/app/ui/badge";
import { quizzes } from "@/app/lib/quizzes";
import Image from "next/image";

export default function BadgesPage() {
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
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-8 w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ユーザーが獲得したバッジのIDリスト
  const userBadgeIds = user.badges.map((badge) => badge.quizId);

  // 全てのバッジ（獲得済みと未獲得）を表示するためのデータ準備
  const allBadges = quizzes.map((quiz) => {
    const userBadge = user.badges.find((badge) => badge.quizId === quiz.id);
    return {
      id: quiz.id,
      name: quiz.badge.name,
      description: quiz.badge.description,
      imageUrl: quiz.badge.imageUrl,
      quizId: quiz.id,
      achieved: !!userBadge,
      achievedAt: userBadge?.achievedAt || null,
    };
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">バッジコレクション</h1>

        <div className="mb-10">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">獲得済みバッジ</h2>
            <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {user.badges.length}/{allBadges.length}
            </span>
          </div>

          {user.badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {user.badges.map((badge) => (
                <div key={badge.id} className="flex justify-center">
                  <Badge badge={badge} size="lg" showDetails={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-4">
                まだバッジを獲得していません。テストに挑戦しましょう！
              </p>
              <button
                onClick={() => router.push("/quizzes")}
                className="btn btn-primary"
              >
                テストに挑戦する
              </button>
            </div>
          )}
        </div>

        {allBadges.some((badge) => !badge.achieved) && (
          <div>
            <h2 className="text-2xl font-bold mb-6">未獲得バッジ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {allBadges
                .filter((badge) => !badge.achieved)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center opacity-60"
                  >
                    <div className="relative w-16 h-16 mb-2 grayscale">
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
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
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-700 text-center">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {badge.description}
                    </p>
                    <button
                      onClick={() => router.push(`/quizzes/${badge.quizId}`)}
                      className="mt-3 text-xs text-blue-600 hover:underline"
                    >
                      獲得方法を見る
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-6 mt-10">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            バッジについて
          </h3>
          <p className="text-blue-700">
            バッジはテストでの成績や特定の条件を達成することで獲得できます。
            コレクションを完成させて、あなたの知識をアピールしましょう！
          </p>
        </div>
      </div>
    </>
  );
}
