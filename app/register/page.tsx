"use client";

import React from "react";
import Navbar from "@/app/ui/navbar";
import RegisterForm from "@/app/ui/register-form";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  // すでにログインしている場合はダッシュボードへリダイレクト
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl font-bold mb-4">新規登録</h1>
            <p className="text-lg text-gray-600 mb-6">
              アカウントを作成して、クイズの進捗を保存し、バッジを集めましょう。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-blue-700 mb-2">
                会員特典
              </h2>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>無料でさまざまなクイズに挑戦できます</li>
                <li>クイズの結果に応じてユニークなバッジが獲得できます</li>
                <li>自分の成績を記録して、いつでも振り返ることができます</li>
                <li>定期的に追加される新しいクイズにいち早く挑戦できます</li>
                <li>ランキングに参加して、他のユーザーと競い合えます</li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
}
