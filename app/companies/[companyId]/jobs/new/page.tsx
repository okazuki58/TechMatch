"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import JobForm from "@/app/ui/company/job-form";
import { Company, Job } from "@/app/lib/definitions";
import { useAuth } from "@/app/lib/contexts/auth-context";

// 仮のデータ取得関数
const fetchCompany = async (companyId: string): Promise<Company | null> => {
  // 実際のAPIが実装されたらここを置き換える
  const mockCompanies = [
    {
      id: "company-001",
      name: "テックイノベーション株式会社",
      // 他のプロパティ...
    },
    // 他の企業データ...
  ] as Company[];

  return mockCompanies.find((company) => company.id === companyId) || null;
};

// 仮の求人作成関数
const createJob = async (jobData: Partial<Job>): Promise<void> => {
  // 実際のAPIが実装されたらここを置き換える
  console.log("新規求人を作成:", jobData);
  // 成功を模擬するために1秒待機
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function NewJobPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 認証チェック（実際の実装ではユーザーが企業の管理者かどうかも確認する）
    if (!user) {
      router.push("/login");
      return;
    }

    const loadCompany = async () => {
      try {
        const companyData = await fetchCompany(companyId);
        setCompany(companyData);
      } catch (error) {
        console.error("企業データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [companyId, router, user]);

  const handleSubmit = async (jobData: Partial<Job>) => {
    try {
      await createJob({
        ...jobData,
        companyId: companyId,
        postedAt: new Date(),
        updatedAt: new Date(),
      });

      // 成功したら求人管理ページにリダイレクト
      router.push(`/companies/${companyId}/jobs`);
    } catch (error) {
      console.error("求人の作成に失敗しました:", error);
      alert("求人の作成に失敗しました。もう一度お試しください。");
    }
  };

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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/companies/${companyId}/jobs`}
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
            求人管理に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">新規求人の作成</h1>
            <p className="mb-6 text-gray-600">
              {company.name}の新しい求人情報を入力してください。
            </p>

            <JobForm companyId={companyId} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
