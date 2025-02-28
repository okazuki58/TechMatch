import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/app/ui/navbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            ようこそ、{session.user.name || "ユーザー"}さん
          </h2>
          <p className="text-gray-600">
            DevExamでプログラミングスキルを磨きましょう。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">最近の演習</h3>
            <p className="text-gray-500">まだ演習に取り組んでいません。</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              演習を探す
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">あなたの統計</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">完了した演習:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">獲得したバッジ:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ランキング:</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
