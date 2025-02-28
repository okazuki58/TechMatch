"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import CompanyCard from "@/app/ui/company/company-card";
import { Company } from "@/app/lib/definitions";

// 仮のデータ取得関数（実際のAPIが実装されるまでの仮実装）
const fetchCompanies = async (): Promise<Company[]> => {
  // 実際のAPIが実装されたらここを置き換える
  return [
    {
      id: "company-001",
      name: "テックイノベーション株式会社",
      description:
        "最先端のWeb技術を活用したサービス開発を行うテクノロジー企業です。チームの多様性を重視し、リモートワークを推進しています。",
      industry: "Webサービス",
      location: "東京",
      employeeCount: 120,
      websiteUrl: "https://example.com",
      logoUrl: "/company/company01.jpg",
      createdAt: new Date("2023-01-15"),
      jobCount: 3,
    },
    {
      id: "company-002",
      name: "フューチャーソフト",
      description:
        "AI・機械学習を活用したソリューションを提供する企業です。未経験からのエンジニア育成に力を入れています。",
      industry: "AI・ソフトウェア開発",
      location: "大阪",
      employeeCount: 85,
      websiteUrl: "https://example.com",
      logoUrl: "/company/company02.jpg",
      createdAt: new Date("2022-08-10"),
      jobCount: 2,
    },
    {
      id: "company-003",
      name: "クラウドシステムズ",
      description:
        "クラウドインフラの構築・運用を専門とするITサービス企業です。エンジニアのスキルアップを支援する充実した研修制度があります。",
      industry: "クラウドサービス",
      location: "福岡",
      employeeCount: 50,
      websiteUrl: "https://example.com",
      logoUrl: "/company/company03.jpg",
      createdAt: new Date("2023-03-22"),
      jobCount: 1,
    },
  ];
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("企業データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // 検索とフィルタリングを適用した企業リスト
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      industryFilter === "" || company.industry === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  // 業種の一覧を取得（重複なし）
  const industries = Array.from(
    new Set(companies.map((company) => company.industry))
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">企業一覧</h1>
          <Link
            href="/jobs"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            求人を探す
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="企業名や説明で検索..."
              />
            </div>

            <div>
              <select
                id="industry-filter"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">すべての業種</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                showJobCount={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              企業が見つかりませんでした
            </h3>
            <p className="mt-1 text-gray-500">
              検索条件を変更して、もう一度お試しください。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
