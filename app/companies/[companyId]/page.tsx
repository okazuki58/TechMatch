"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/ui/navbar";
import JobCard from "@/app/ui/company/job-card";
import { Company, Job } from "@/app/lib/definitions";

export default function CompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/${companyId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("企業が見つかりませんでした");
          }
          throw new Error("企業情報の取得に失敗しました");
        }

        const companyData = await response.json();
        console.log("取得した企業データ:", companyData);
        setCompany(companyData);
        setJobs(companyData.jobs || []);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError(
          error instanceof Error ? error.message : "不明なエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !company) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">
              {error || "企業が見つかりませんでした"}
            </h2>
            <p className="mt-2 text-gray-500">
              指定された企業IDは存在しないか、削除された可能性があります。
            </p>
            <Link
              href="/companies"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              企業一覧に戻る
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link
            href="/companies"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            企業一覧に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative w-full h-64 bg-gray-100">
            {/* 会社ヘッダー背景 */}
            {company.logoUrl ? (
              <div className="absolute inset-0">
                <Image
                  src={company.headerImageUrl}
                  alt={`${company.name}のヘッダー画像`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex items-center">
                <div className="h-16 w-16 relative mr-4 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 3 16v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zm-8 18H5v-5.586l3-3 3 3V20zm8 0h-6v-4a.999.999 0 0 0 .707-1.707L9 9.586V4h10v16z" />
                    <path d="M11 6h2v2h-2zm4 0h2v2h-2zm0 4.031h2V12h-2zM15 14h2v2h-2zm-8 1h2v2H7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {company.industry && (
                  <span className="px-3 py-1 bg-blue-500/80 text-white text-sm rounded-full">
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="px-3 py-1 bg-gray-600/80 text-white text-sm rounded-full">
                    {company.location}
                  </span>
                )}
                {company.employeeCount && (
                  <span className="px-3 py-1 bg-gray-600/80 text-white text-sm rounded-full">
                    従業員数: {company.employeeCount}名
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {company.websiteUrl && (
              <div className="mt-4">
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  企業サイトを見る
                </a>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3">企業概要</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {company.description || "企業概要はまだ登録されていません。"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {company.location && (
                <div>
                  <span className="block text-gray-500">所在地</span>
                  <span className="font-medium">{company.location}</span>
                </div>
              )}
              {company.foundedYear && (
                <div>
                  <span className="block text-gray-500">設立年</span>
                  <span className="font-medium">{company.foundedYear}年</span>
                </div>
              )}
              {company.size && (
                <div>
                  <span className="block text-gray-500">企業規模</span>
                  <span className="font-medium">
                    {company.size === "startup"
                      ? "スタートアップ"
                      : company.size === "small"
                      ? "小規模"
                      : company.size === "medium"
                      ? "中規模"
                      : company.size === "large"
                      ? "大規模"
                      : "大企業"}
                  </span>
                </div>
              )}
              {company.employeeCount && (
                <div>
                  <span className="block text-gray-500">従業員数</span>
                  <span className="font-medium">{company.employeeCount}名</span>
                </div>
              )}
              {company.email && (
                <div>
                  <span className="block text-gray-500">連絡先メール</span>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {company.email}
                  </a>
                </div>
              )}
              {company.phone && (
                <div>
                  <span className="block text-gray-500">電話番号</span>
                  <span className="font-medium">{company.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">求人情報</h2>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  company={{
                    id: company.id,
                    name: company.name,
                    logoUrl: company.logoUrl,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                現在、この企業からの求人情報はありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
