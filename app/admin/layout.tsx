import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // サーバーサイドでも認証チェック
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">管理パネル</h1>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            ダッシュボード
          </Link>
          <Link
            href="/admin/quizzes"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            クイズ管理
          </Link>
          <Link
            href="/admin/users"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            ユーザー管理
          </Link>
          <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-700">
            サイトに戻る
          </Link>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
