"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";
import { Job, Company } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";
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

const fetchCompanyJobs = async (companyId: string): Promise<Job[]> => {
  // 実際のAPIが実装されたらここを置き換える
  const mockJobs = [
    {
      id: "job-001",
      companyId: "company-001",
      title: "フロントエンドエンジニア",
      // 他のプロパティ...
      postedAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
      isActive: true,
    },
    {
      id: "job-002",
      companyId: "company-001",
      title: "バックエンドエンジニア",
      // 他のプロパティ...
      postedAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-20"),
      isActive: false,
    },
    // 他の求人データ...
  ] as Job[];

  return mockJobs.filter((job) => job.companyId === companyId);
};

export default function CompanyJobsPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 認証チェック（実際の実装ではユーザーが企業の管理者かどうかも確認する）
    if (!user) {
      router.push("/login");
      return;
    }

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
  }, [companyId, router, user]);

  const handleToggleJobStatus = async (
    jobId: string,
    currentStatus: boolean
  ) => {
    try {
      // 実際のAPIが実装されたらここを置き換える
      console.log(
        `求人ID: ${jobId}のステータスを${
          currentStatus ? "非公開" : "公開"
        }に変更`
      );

      // 仮の実装: フロントエンドの状態だけ更新
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, isActive: !currentStatus } : job
        )
      );
    } catch (error) {
      console.error("求人ステータスの更新に失敗しました:", error);
      alert("求人ステータスの更新に失敗しました。もう一度お試しください。");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (
      !confirm("この求人を削除してもよろしいですか？この操作は元に戻せません。")
    ) {
      return;
    }

    try {
      // 実際のAPIが実装されたらここを置き換える
      console.log(`求人ID: ${jobId}を削除`);

      // 仮の実装: フロントエンドの状態だけ更新
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("求人の削除に失敗しました:", error);
      alert("求人の削除に失敗しました。もう一度お試しください。");
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href={`/companies/${companyId}`}
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
              企業ページに戻る
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {company.name} - 求人管理
            </h1>
          </div>

          <Link
            href={`/companies/${companyId}/jobs/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            新規求人を作成
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    求人タイトル
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ステータス
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    掲載日
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    最終更新日
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.isActive ? "公開中" : "非公開"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.postedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          target="_blank"
                        >
                          表示
                        </Link>
                        <Link
                          href={`/companies/${companyId}/jobs/${job.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() =>
                            handleToggleJobStatus(job.id, job.isActive)
                          }
                          className={`${
                            job.isActive
                              ? "text-amber-600 hover:text-amber-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {job.isActive ? "非公開" : "公開"}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              求人がありません
            </h3>
            <p className="mt-1 text-gray-500">
              新しい求人を作成して、人材募集を始めましょう。
            </p>
            <div className="mt-6">
              <Link
                href={`/companies/${companyId}/jobs/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                新規求人を作成
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
