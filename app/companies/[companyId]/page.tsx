"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/ui/navbar";
import JobCard from "@/app/ui/company/job-card";
import { Company, Job } from "@/app/lib/definitions";

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
      logoUrl: "/company/company01.jpg",
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
      about: `
        フューチャーソフトは、2015年に創業したAI・機械学習を専門とするテクノロジー企業です。
        
        【事業内容】
        • 機械学習モデルの開発と実装
        • 自然言語処理ソリューション
        • 画像認識システム
        • データ分析・可視化ツール
        
        【企業理念】
        「テクノロジーで未来を創造する」をモットーに、最先端の技術を活用して社会課題の解決に取り組んでいます。
        
        【特徴】
        • 未経験者向けのAIエンジニア育成プログラム
        • 週1回のナレッジシェアセッション
        • 年2回のハッカソン開催
        • 研究開発費補助制度
      `,
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
      about: `
        クラウドシステムズは、クラウドインフラの専門家集団です。
        AWS、Azure、GCPなどの主要クラウドプラットフォームに精通したエンジニアが、
        お客様のビジネスに最適なクラウド環境を設計・構築・運用します。
        
        【サービス】
        • クラウド移行コンサルティング
        • マルチクラウド環境の設計と構築
        • クラウドネイティブアプリケーション開発
        • 24時間365日のクラウド監視・運用サービス
        
        【人材育成】
        • クラウド資格取得支援制度（受験料全額補助）
        • 技術書籍購入補助
        • 月1回のクラウド技術勉強会
        • メンター制度
      `,
    },
    {
      id: "company-004",
      name: "デジタルクリエイト",
      description:
        "Webデザインからアプリ開発まで、幅広いデジタルサービスを提供するクリエイティブ企業です。若手の意見を積極的に取り入れる風通しの良い社風が特徴です。",
      industry: "デザイン・開発",
      location: "名古屋",
      employeeCount: 65,
      websiteUrl: "https://example.com",
      logoUrl: "/company/company04.jpg",
      createdAt: new Date("2023-05-10"),
      about: `
        デジタルクリエイトは、デザインとテクノロジーを融合させた革新的なデジタルサービスを提供する企業です。
        
        【事業領域】
        • Webサイト・アプリのUI/UXデザイン
        • フロントエンド・バックエンド開発
        • モバイルアプリ開発（iOS/Android）
        • ブランディング・マーケティング支援
        
        【企業文化】
        私たちは「クリエイティビティ」と「テクノロジー」の両方を大切にしています。
        デザイナーとエンジニアが密に連携し、ユーザー体験を最大化するプロダクト開発を行っています。
        
        【働き方】
        • フレックスタイム制
        • リモートワーク可（週3日まで）
        • フリーアドレス
        • カジュアルな社内環境
      `,
    },
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
    {
      id: "job-002",
      companyId: "company-001",
      title: "バックエンドエンジニア",
      description:
        "Node.jsとExpressを使用したAPIの設計・開発を担当していただきます。",
      requirements: [
        "JavaScript/TypeScriptの基本的な知識",
        "Node.jsの実務経験（1年以上）",
        "RESTful APIの設計経験",
      ],
      preferredSkills: ["Express.js", "MongoDB", "GraphQL"],
      location: "東京（リモート可）",
      employmentType: "full-time",
      experienceLevel: "mid",
      salary: {
        min: 450000,
        max: 750000,
        currency: "JPY",
      },
      requiredQuizzes: [
        {
          quizId: "quiz-002",
          minimumScore: 70,
        },
      ],
      postedAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-20"),
      isActive: true,
    },
    {
      id: "job-003",
      companyId: "company-002",
      title: "機械学習エンジニア",
      description: "自然言語処理モデルの開発と実装を担当していただきます。",
      requirements: [
        "Pythonの実務経験（2年以上）",
        "機械学習の基礎知識",
        "PyTorchまたはTensorFlowの使用経験",
      ],
      preferredSkills: [
        "自然言語処理の知識",
        "BERTなどの言語モデルの実装経験",
        "クラウド環境（AWS/GCP）での機械学習モデルのデプロイ経験",
      ],
      location: "大阪",
      employmentType: "full-time",
      experienceLevel: "senior",
      salary: {
        min: 600000,
        max: 900000,
        currency: "JPY",
      },
      requiredQuizzes: [
        {
          quizId: "quiz-003",
          minimumScore: 80,
        },
      ],
      postedAt: new Date("2023-05-10"),
      updatedAt: new Date("2023-05-10"),
      isActive: true,
    },
  ] as Job[]; // 型アサーションを追加

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

  // 企業ロゴのパスを設定（ない場合はデフォルト画像）
  const logoPath =
    company.logoUrl ||
    `/company/company0${(parseInt(company.id.split("-")[1]) % 4) + 1}.jpg`;

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
            <Image
              src={logoPath}
              alt={`${company.name}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/80 text-white text-sm rounded-full">
                  {company.industry}
                </span>
                <span className="px-3 py-1 bg-gray-600/80 text-white text-sm rounded-full">
                  {company.location}
                </span>
                <span className="px-3 py-1 bg-gray-600/80 text-white text-sm rounded-full">
                  従業員数: {company.employeeCount}名
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
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
