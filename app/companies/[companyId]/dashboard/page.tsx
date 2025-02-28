"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/ui/navbar";
import JobCard from "@/app/ui/company/job-card";
import { Company, Job } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";

// 仮のデータ取得関数
const fetchCompany = async (companyId: string): Promise<Company | null> => {
  // 実際のAPIが実装されたらここを置き換える
  const mockCompanies = [
    {
      id: "company-001",
      name: "テックイノベーション株式会社",
      description:
        "最先端のWeb技術を活用したサービス開発を行うテクノロジー企業です。チームの多様性を重視し、リモートワークを推進しています。",
      industry: "Webサービス",
      location: "東京",
      employeeCount: 120,
      websiteUrl: "https://example.com",
      logoUrl: "",
      createdAt: new Date("2023-01-15"),
      about: `
        テックイノベーション株式会社は、2018年に設立されたテクノロジー企業です。
        私たちは、最新のWeb技術を活用して、企業や個人のデジタル変革を支援しています。
        
        【ミッション】
        テクノロジーの力で、人々の生活をより豊かにする。
        
        【企業文化】
        • 挑戦を恐れない姿勢
        • 多様性の尊重
        • 継続的な学習と成長
        • オープンなコミュニケーション
        
        【福利厚生】
        • フレックスタイム制
        • リモートワーク可能
        • 書籍購入支援
        • 技術カンファレンス参加支援
        • 社内勉強会
      `,
    },
    // 他の企業データ...
  ];

  return mockCompanies.find((company) => company.id === companyId) || null;
};

const fetchCompanyJobs = async (companyId: string): Promise<Job[]> => {
  // 実際のAPIが実装されたらここを置き換える
  const mockJobs = [
    {
      id: "job-001",
      companyId: "company-001",
      title: "フロントエンドエンジニア",
      description:
        "Reactを使用したWebアプリケーション開発を担当していただきます。",
      requirements: [
        "HTML/CSS/JavaScriptの基本的な知識",
        "Reactの実務経験（1年以上）",
        "GitHubを使用したチーム開発経験",
      ],
      preferredSkills: ["TypeScript", "Next.js", "Tailwind CSS"],
      location: "東京（リモート可）",
      employmentType: "full-time",
      experienceLevel: "mid",
      salary: {
        min: 400000,
        max: 700000,
        currency: "JPY",
      },
      requiredQuizzes: [
        {
          quizId: "quiz-001",
          minimumScore: 70,
        },
      ],
      postedAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
      isActive: true,
    },
    // 他の求人データ...
  ] as Job[];

  return mockJobs.filter((job) => job.companyId === companyId);
};

export default function CompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companyData, jobsData] = await Promise.all([
          fetchCompany(companyId),
          fetchCompanyJobs(companyId),
        ]);

        setCompany(companyData);
        setJobs(jobsData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  if (!company) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">
              企業が見つかりませんでした
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
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {company.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {company.industry}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {company.location}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    従業員数: {company.employeeCount}名
                  </span>
                </div>

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
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3">企業概要</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {company.about || company.description}
              </p>
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
