"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);
      if (user) {
        router.push("/dashboard");
      } else {
        setError("メールアドレスまたはパスワードが間違っています");
      }
    } catch (err) {
      setError("ログイン中にエラーが発生しました");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary"
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は
          <a href="/register" className="text-blue-600 hover:underline">
            新規登録
          </a>
        </p>
      </div>

      {/* デモ用のヒント */}
      <div className="mt-6 bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>デモ用アカウント:</strong>
          <br />
          Email: test@example.com
          <br />
          Password: password123
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
