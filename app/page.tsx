"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import Link from "next/link";
import { useAuth } from "@/app/lib/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="inline-block bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full mb-4 animate-pulse">
                すべてのテスト・演習が完全無料
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                あなたの技術力を<span className="text-blue-600">証明</span>して
                <span className="text-blue-600">キャリア</span>を加速させよう
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                DevExamは、実務レベルの演習とスキルテストを通じて、あなたの本当の実力を企業にアピールできるプラットフォームです。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/quizzes")}
                  className="btn btn-primary px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                >
                  テストに挑戦する
                </button>

                {!user ? (
                  <Link
                    href="/login"
                    className="btn btn-outline px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
                  >
                    ログイン
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="btn btn-outline px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
                  >
                    マイダッシュボード
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80">
                {/* ここには適切なイラストや画像を配置します */}
                <div className="bg-blue-600 rounded-xl shadow-xl p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4">DevExamの実績</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>月間5,000人以上のエンジニアが利用</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>提携企業100社以上</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>年間転職成功者500名以上</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* サービスの特徴セクション */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          DevExamが選ばれる理由
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              実務レベルのスキル評価
            </h3>
            <p className="text-gray-600">
              実際の業務を想定した実践的な演習問題で、本当の実力を測定。単なる知識だけでなく、応用力を評価します。
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">企業とのマッチング</h3>
            <p className="text-gray-600">
              あなたのスキルプロファイルに基づいて、最適な企業からのオファーを受け取ることができます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">スキル証明書の発行</h3>
            <p className="text-gray-600">
              テスト結果に基づいたスキル証明書を発行。履歴書に添付して、客観的な技術力をアピールできます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">完全無料で利用可能</h3>
            <p className="text-gray-600">
              すべてのテストと演習が無料で利用可能。スキルアップと転職支援に必要なツールをコストなしで提供します。
            </p>
          </div>
        </div>
      </div>

      {/* 利用の流れセクション */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            DevExamの使い方
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">アカウント作成</h3>
              <div className="rounded-lg overflow-hidden mb-4 w-full h-48 relative">
                {/* ここに画像を挿入 */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                  アカウント作成の画像
                </div>
                {/* 実際の画像を挿入する場合:
                <Image 
                  src="/images/step1-signup.png"
                  alt="アカウント作成ステップ"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <p className="text-gray-600">
                無料でアカウントを作成して、プロフィールを設定します。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">テストに挑戦</h3>
              <div className="rounded-lg overflow-hidden mb-4 w-full h-48 relative">
                {/* ここに画像を挿入 */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                  テスト画面の画像
                </div>
                {/* 実際の画像:
                <Image 
                  src="/images/step2-quiz.png"
                  alt="テスト挑戦ステップ"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <p className="text-gray-600">
                あなたのスキルセットに合わせたテストや演習に挑戦します。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">スキルの証明</h3>
              <div className="rounded-lg overflow-hidden mb-4 w-full h-48 relative">
                {/* ここに画像を挿入 */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                  スキル証明書の画像
                </div>
                {/* 実際の画像:
                <Image 
                  src="/images/step3-certificate.png"
                  alt="スキル証明ステップ"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <p className="text-gray-600">
                結果に基づいたスキル証明書を獲得し、プロフィールに表示します。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">企業からのオファー</h3>
              <div className="rounded-lg overflow-hidden mb-4 w-full h-48 relative">
                {/* ここに画像を挿入 */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                  オファー受信の画像
                </div>
                {/* 実際の画像:
                <Image 
                  src="/images/step4-offer.png"
                  alt="企業オファーステップ"
                  fill
                  className="object-cover"
                /> */}
              </div>
              <p className="text-gray-600">
                あなたのスキルに興味を持った企業からオファーを受け取ります。
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/register")}
              className="btn btn-primary px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              今すぐ始める
            </button>
          </div>
        </div>
      </div>

      {/* 企業パートナーセクション */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">提携企業</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* ここには実際の企業ロゴが入ります */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center"
            >
              <div className="h-16 w-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                企業ロゴ {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 成功事例セクション */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">転職成功事例</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">田中 太郎さん</h3>
                  <p className="text-sm text-gray-600">Webエンジニア</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                「DevExamのテストで実力を証明できたおかげで、希望していた企業からオファーを受け取ることができました。」
              </p>
              <p className="text-sm text-gray-500">
                転職先: 株式会社テックイノベーション
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">鈴木 花子さん</h3>
                  <p className="text-sm text-gray-600">
                    バックエンドエンジニア
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                「実務レベルの演習に取り組むことで、実際の仕事で必要なスキルを身につけることができました。年収も50%アップしました。」
              </p>
              <p className="text-sm text-gray-500">
                転職先: グローバルテック株式会社
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">佐藤 健太さん</h3>
                  <p className="text-sm text-gray-600">
                    データサイエンティスト
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                「未経験の分野でしたが、DevExamのテストで基礎スキルを証明できたことが転職成功の鍵となりました。」
              </p>
              <p className="text-sm text-gray-500">
                転職先: AIソリューションズ株式会社
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA セクション */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            あなたのキャリアを次のレベルへ
          </h2>
          <p className="text-xl mb-8">
            DevExamで<span className="font-bold underline">完全無料</span>
            の実力テストを受けて、理想の企業からオファーを受け取りましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="btn px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
            >
              無料で登録する
            </button>
            <button
              onClick={() => router.push("/quizzes")}
              className="btn px-8 py-4 bg-blue-700 text-white border border-white rounded-lg hover:bg-blue-800 transition text-lg font-semibold"
            >
              テストを探す
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
