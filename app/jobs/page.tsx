"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { getJobs, getEligibleJobs } from "@/app/lib/jobs";
import { Job } from "@/app/lib/definitions";
import Navbar from "@/app/ui/navbar";
import JobCard from "@/app/ui/company/job-card";
import Link from "next/link";

// 型定義
type SalaryRange = {
  min: number;
  max: number;
  currency: string;
};

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<
    { id: string; name: string; logoUrl: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salaryRange, setSalaryRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);

  const toggleEmploymentType = (type: string) => {
    setEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleEligibleToggle = useCallback(async () => {
    setIsLoading(true);
    try {
      // 条件に応じてデータを取得
      let jobsData = [];
      if (!showEligibleOnly) {
        // これから適格な求人のみを表示する
        jobsData = await getEligibleJobs();
        setShowEligibleOnly(true);
      } else {
        // すべての求人を表示する
        jobsData = await getJobs();
        setShowEligibleOnly(false);
      }
      setJobs(jobsData);
    } catch (error) {
      console.error("求人データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [showEligibleOnly]);

  // 求人と会社データの取得
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);

      const response = await fetch("/api/companies");
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      const companiesData = await response.json();
      setCompanies(companiesData);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回データ取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // フィルタリング条件が変わった時に求人をフィルタリング
  useEffect(() => {
    setFilteredJobs(applyFilters(jobs));
  }, [jobs, searchTerm, employmentTypes, experienceLevels, salaryRange]);

  // フィルタリング関数
  const applyFilters = (data: Job[]) => {
    let result = [...data];

    // キーワード検索
    if (searchTerm) {
      const terms = searchTerm.toLowerCase().split(" ");
      result = result.filter((job) => {
        const searchableText = `${job.title} ${
          job.description
        } ${job.requirements.join(" ")} ${job.preferredSkills.join(
          " "
        )}`.toLowerCase();
        return terms.every((term) => searchableText.includes(term));
      });
    }

    // 雇用形態
    if (employmentTypes.length > 0) {
      result = result.filter((job) =>
        employmentTypes.includes(job.employmentType)
      );
    }

    // 経験レベル
    if (experienceLevels.length > 0) {
      result = result.filter((job) =>
        experienceLevels.includes(job.experienceLevel)
      );
    }

    // 給与範囲
    if (salaryRange.min) {
      result = result.filter(
        (job) => (job.salary as SalaryRange).min >= salaryRange.min!
      );
    }
    if (salaryRange.max) {
      result = result.filter(
        (job) => (job.salary as SalaryRange).max <= salaryRange.max!
      );
    }

    return result;
  };

  // フィルターのリセット
  const resetFilters = () => {
    setSearchTerm("");
    setEmploymentTypes([]);
    setExperienceLevels([]);
    setSalaryRange({});
    if (showEligibleOnly) {
      handleEligibleToggle();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">求人検索</h1>
          <Link
            href="/companies"
            className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
          >
            企業を見る
          </Link>
        </div>

        {/* メインコンテンツ - サイドバーを広げ、求人カードを狭める */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* サイドバー - 幅を広げる */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">求人を絞り込む</h2>

              {/* 検索フォーム - デザイン改善 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キーワード検索
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="職種、スキル、キーワード..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 雇用形態フィルター */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  雇用形態
                </h3>
                <div className="space-y-2">
                  {["full-time", "part-time", "contract", "internship"].map(
                    (type) => {
                      const label =
                        type === "full-time"
                          ? "正社員"
                          : type === "part-time"
                          ? "パートタイム"
                          : type === "contract"
                          ? "契約社員"
                          : "インターン";

                      return (
                        <div key={type} className="flex items-center">
                          <input
                            id={`employment-${type}`}
                            type="checkbox"
                            checked={employmentTypes.includes(type)}
                            onChange={() => toggleEmploymentType(type)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`employment-${type}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {label}
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* 経験レベルフィルター */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  経験レベル
                </h3>
                <div className="space-y-2">
                  {["entry", "mid", "senior"].map((level) => {
                    const label =
                      level === "entry"
                        ? "未経験可"
                        : level === "mid"
                        ? "中級者向け"
                        : "上級者向け";

                    return (
                      <div key={level} className="flex items-center">
                        <input
                          id={`level-${level}`}
                          type="checkbox"
                          checked={experienceLevels.includes(level)}
                          onChange={() => toggleExperienceLevel(level)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`level-${level}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 給与範囲フィルター */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  給与範囲（万円/月）
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-salary" className="sr-only">
                      最低給与
                    </label>
                    <input
                      id="min-salary"
                      type="number"
                      placeholder="最低給与"
                      value={salaryRange.min || ""}
                      onChange={(e) =>
                        setSalaryRange({
                          ...salaryRange,
                          min: e.target.value
                            ? Number(e.target.value) * 10000
                            : undefined,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-salary" className="sr-only">
                      最高給与
                    </label>
                    <input
                      id="max-salary"
                      type="number"
                      placeholder="最高給与"
                      value={salaryRange.max || ""}
                      onChange={(e) =>
                        setSalaryRange({
                          ...salaryRange,
                          max: e.target.value
                            ? Number(e.target.value) * 10000
                            : undefined,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* テスト条件フィルター */}
              {user && (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      応募資格あり
                    </h3>
                    <button
                      onClick={handleEligibleToggle}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        showEligibleOnly ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          showEligibleOnly ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    あなたのテスト結果で応募可能な求人のみを表示します
                  </p>
                </div>
              )}

              {/* リセットボタン - デザイン改善 */}
              <button
                onClick={resetFilters}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 mt-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                絞り込みをリセット
              </button>
            </div>
          </div>

          {/* 右側の求人カード一覧 - 幅を狭める */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    company={companies.find((c) => c.id === job.companyId)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  条件に一致する求人が見つかりませんでした。
                </p>
                <p className="text-gray-500 mt-2">
                  検索条件を変更してお試しください。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
