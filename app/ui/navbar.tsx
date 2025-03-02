// app/ui/navbar.tsx
"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useClickAway } from "react-use";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  // メニューとボタン以外がクリックされたとき
  useClickAway(menuRef, (event: Event) => {
    // ボタンをクリックした場合は無視（ボタンクリックは別途処理）
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    // メニューを閉じる
    setIsMenuOpen(false);
  });

  // ナビゲーションリンクのスタイルを決定する関数
  const getLinkClassName = (path: string) => {
    const baseClasses =
      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    return pathname === path
      ? `${baseClasses} border-blue-500 text-blue-700`
      : `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
  };

  // モバイル用のリンクスタイルを決定する関数
  const getMobileLinkClassName = (path: string) => {
    const baseClasses = "block pl-3 pr-4 py-2 border-l-4 text-base font-medium";
    return pathname === path
      ? `${baseClasses} border-blue-500 text-blue-700 bg-blue-50`
      : `${baseClasses} border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-700">DevExam</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={getLinkClassName("/")}>
                ホーム
              </Link>
              <Link href="/quizzes" className={getLinkClassName("/quizzes")}>
                スキルテスト
              </Link>
              <Link
                href="/exercises"
                className={getLinkClassName("/exercises")}
              >
                演習問題
              </Link>
              <Link href="/jobs" className={getLinkClassName("/jobs")}>
                求人情報
              </Link>
              <Link
                href="/companies"
                className={getLinkClassName("/companies")}
              >
                企業一覧
              </Link>
              <Link
                href="/leaderboard"
                className={getLinkClassName("/leaderboard")}
              >
                ランキング
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-sm rounded-full hover:bg-gray-50 p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <div className="ml-2 flex flex-col items-start">
                    <span className="text-gray-800 font-medium line-clamp-1">
                      {user.name || user.email?.split("@")[0] || "ユーザー"}
                    </span>
                    {user.name && user.email && (
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-5 h-5 ml-1 text-gray-400 transition-transform duration-200 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      プロフィール
                    </Link>
                    <Link
                      href="/badges"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      獲得バッジ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">メニューを開く</span>
              {/* ハンバーガーアイコン */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* 閉じるアイコン */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className={getMobileLinkClassName("/")}>
            ホーム
          </Link>
          <Link href="/quizzes" className={getMobileLinkClassName("/quizzes")}>
            スキルテスト
          </Link>
          <Link href="/jobs" className={getMobileLinkClassName("/jobs")}>
            求人情報
          </Link>
          <Link
            href="/companies"
            className={getMobileLinkClassName("/companies")}
          >
            企業一覧
          </Link>
          <Link
            href="/leaderboard"
            className={getMobileLinkClassName("/leaderboard")}
          >
            ランキング
          </Link>
        </div>

        {user ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-medium">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user.name || user.email || "ユーザー"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                プロフィール
              </Link>
              <Link
                href="/badges"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                獲得バッジ
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                ログアウト
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                新規登録
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
