"use client";

import React from "react";
import Navbar from "@/app/ui/navbar";
import LoginForm from "@/app/ui/login-form";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
            <h1 className="text-3xl font-bold mb-4">クイズアプリへようこそ</h1>
            <p className="text-lg text-gray-600 mb-6">
              ログインして、あなたのクイズの進捗を保存し、バッジを集めましょう。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-blue-700 mb-2">
                ログインすると利用できる機能
              </h2>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>クイズの進捗の保存</li>
                <li>バッジの獲得と管理</li>
                <li>クイズの履歴の確認</li>
                <li>ランキングへの参加</li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
