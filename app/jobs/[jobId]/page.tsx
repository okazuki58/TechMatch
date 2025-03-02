"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getJobById } from "@/app/lib/jobs";
import { useAuth } from "@/app/lib/contexts/auth-context";
import Navbar from "@/app/ui/navbar";
import { Company, Job } from "@/app/lib/definitions";

interface SalaryRange {
  min: number;
  max: number;
  currency?: string;
}

export default function JobPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    async function fetchJobAndCompany() {
      try {
        const jobData = await getJobById(params.jobId);
        setJob(jobData);

        // 会社情報の設定方法を修正
        if (jobData.company) {
          // jobDataに含まれる会社情報を使用
          setCompany(jobData.company);
        } else {
          // 会社情報が含まれていない場合は別途API呼び出し
          const companyResponse = await fetch(
            `/api/companies/${jobData.companyId}`
          );
          if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            setCompany(companyData);
          }
        }

        // 応募資格チェック
        if (user) {
          const eligibleResponse = await fetch(
            `/api/jobs/eligible?jobId=${params.jobId}`
          );
          if (eligibleResponse.ok) {
            const { isEligible } = await eligibleResponse.json();
            setIsEligible(isEligible);
          }
        }
      } catch (error) {
        console.error("求人情報の取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobAndCompany();
  }, [params.jobId, user]);

  const handleApply = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: params.jobId,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        throw new Error("応募に失敗しました");
      }
    } catch (error) {
      console.error("応募中にエラーが発生しました:", error);
      alert("応募に失敗しました。もう一度お試しください。");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                求人が見つかりませんでした
              </h2>
              <p className="text-gray-600 mb-6">
                お探しの求人は存在しないか、削除された可能性があります。
              </p>
              <button
                onClick={() => router.push("/jobs")}
                className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                求人一覧に戻る
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* ヒーローエリア */}
        <div className="w-full h-72 md:h-96 relative bg-gradient-to-r from-blue-900 to-blue-700">
          {job.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {job.title}
                </h1>
                <div className="flex items-center mb-6">
                  {/* {company?.logoUrl && (
                    <div className="h-10 w-10 relative mr-3 bg-white rounded-full p-1">
                      <Image
                        src={company.logoUrl}
                        alt={company?.name || ""}
                        fill
                        className="rounded-full object-contain"
                      />
                    </div>
                  )} */}
                  <div className="h-10 w-10 relative mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 3 16v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zm-8 18H5v-5.586l3-3 3 3V20zm8 0h-6v-4a.999.999 0 0 0 .707-1.707L9 9.586V4h10v16z" />
                      <path d="M11 6h2v2h-2zm4 0h2v2h-2zm0 4.031h2V12h-2zM15 14h2v2h-2zm-8 1h2v2H7z" />
                    </svg>
                  </div>
                  <span className="text-xl text-white font-medium">
                    {company?.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {job.location}
                  </span>
                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {job.employmentType === "full-time"
                      ? "正社員"
                      : job.employmentType === "part-time"
                      ? "パートタイム"
                      : job.employmentType === "contract"
                      ? "契約社員"
                      : "インターン"}
                  </span>
                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {job.experienceLevel === "entry"
                      ? "未経験可"
                      : job.experienceLevel === "mid"
                      ? "中級者向け"
                      : "上級者向け"}
                  </span>
                  <span className="bg-green-500 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {`${(job.salary as SalaryRange).min / 10000}〜${
                      (job.salary as SalaryRange).max / 10000
                    }万円`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左側のメインコンテンツ */}
            <div className="lg:w-2/3">
              {/* 応募成功メッセージ */}
              {showSuccessMessage && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="font-medium">
                      応募が完了しました！企業からの連絡をお待ちください。
                    </p>
                  </div>
                </div>
              )}

              {/* 主要セクション */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                {/* 求人の詳細説明 */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    求人詳細
                  </h2>
                  <div className="prose max-w-none">
                    {job.description.split("\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-4 text-gray-700 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 必須スキル */}
                <div className="p-8 bg-gray-50 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    必須要件
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 歓迎スキル */}
                <div className="p-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    歓迎スキル
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 会社情報 */}
              {company && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      企業情報
                    </h2>
                    <div className="flex items-center mb-4">
                      {/* {company.logoUrl && (
                        <div className="h-16 w-16 relative mr-4 bg-white rounded-full shadow-sm p-1">
                          <Image
                            src={company.logoUrl}
                            alt={company.name}
                            fill
                            className="rounded-full object-contain"
                          />
                        </div>
                      )} */}
                      <div className="h-16 w-16 relative mr-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-9 h-9 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 3 16v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zm-8 18H5v-5.586l3-3 3 3V20zm8 0h-6v-4a.999.999 0 0 0 .707-1.707L9 9.586V4h10v16z" />
                          <path d="M11 6h2v2h-2zm4 0h2v2h-2zm0 4.031h2V12h-2zM15 14h2v2h-2zm-8 1h2v2H7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{company.name}</h3>
                        <p className="text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{company.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-500">所在地</span>
                        <span className="font-medium">{company.location}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">設立年</span>
                        <span className="font-medium">
                          {company.foundedYear}年
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">従業員数</span>
                        <span className="font-medium">
                          {company.employeeCount}名
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">
                          ウェブサイト
                        </span>
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          公式サイトを見る
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 右側のサイドバー */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  応募する
                </h3>

                {!user ? (
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      応募するにはログインが必要です。
                    </p>
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      ログインして応募
                    </button>
                  </div>
                ) : !isEligible ? (
                  <div className="mb-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            この求人に応募するには、必要なテストを受ける必要があります。
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/quizzes")}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      テストを受ける
                    </button>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            テスト結果が条件を満たしています。応募できます！
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className={`w-full py-3 ${
                        isApplying
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white rounded-lg transition flex items-center justify-center`}
                    >
                      {isApplying ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          応募処理中...
                        </>
                      ) : (
                        "今すぐ応募する"
                      )}
                    </button>
                  </div>
                )}

                {/* 募集要項サマリー */}
                <div className="border-t border-gray-200 pt-6 mt-2">
                  <h4 className="font-semibold text-gray-800 mb-4">募集要項</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-500">勤務地</span>
                      <span className="font-medium text-gray-900">
                        {job.location}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">雇用形態</span>
                      <span className="font-medium text-gray-900">
                        {job.employmentType === "full-time"
                          ? "正社員"
                          : job.employmentType === "part-time"
                          ? "パートタイム"
                          : job.employmentType === "contract"
                          ? "契約社員"
                          : "インターン"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">経験レベル</span>
                      <span className="font-medium text-gray-900">
                        {job.experienceLevel === "entry"
                          ? "未経験可"
                          : job.experienceLevel === "mid"
                          ? "中級者向け"
                          : "上級者向け"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">給与</span>
                      <span className="font-medium text-gray-900">
                        {`${(job.salary as SalaryRange).min / 10000}〜${
                          (job.salary as SalaryRange).max / 10000
                        }万円`}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">掲載日</span>
                      <span className="font-medium text-gray-900">
                        {new Date(job.postedAt).toLocaleDateString("ja-JP")}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* シェアボタン */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    求人をシェアする
                  </h4>
                  <div className="flex space-x-3">
                    <button className="flex-1 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center justify-center">
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                    <button className="flex-1 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center justify-center">
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z" />
                      </svg>
                      Twitter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
