import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Job, QuizResult } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils";

interface JobCardProps {
  job: Job;
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  userQuizResults?: QuizResult[];
  compact?: boolean;
}

export default function JobCard({
  job,
  company,
  userQuizResults,
  compact = false,
}: JobCardProps) {
  const logoPath =
    company?.logoUrl ||
    `/company/company0${
      (parseInt(company?.id.split("-")[1] || "0") % 4) + 1
    }.jpg`;
  // ユーザーがこの求人に応募可能かチェック
  const isEligible = React.useMemo(() => {
    if (!job.requiredQuizzes || job.requiredQuizzes.length === 0) return true;
    if (!userQuizResults) return false;

    return job.requiredQuizzes.every((requiredQuiz) => {
      const userResult = userQuizResults.find(
        (result) => result.quizId === requiredQuiz.quizId
      );
      if (!userResult) return false;

      const percentageScore = (userResult.score / userResult.maxScore) * 100;
      return percentageScore >= requiredQuiz.minimumScore;
    });
  }, [job, userQuizResults]);

  // 雇用形態の表示名
  const employmentTypeLabel = {
    "full-time": "正社員",
    "part-time": "パートタイム",
    contract: "契約社員",
    internship: "インターンシップ",
  }[job.employmentType];

  // 経験レベルの表示名
  const experienceLevelLabel = {
    entry: "未経験・エントリー",
    mid: "中級者",
    senior: "シニア",
  }[job.experienceLevel];

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
        <div className="flex justify-between">
          <h3 className="font-semibold">{job.title}</h3>
          <span className="text-sm text-gray-500">
            {formatDate(job.postedAt)}
          </span>
        </div>
        <div className="mt-2 flex space-x-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
            {employmentTypeLabel}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {experienceLevelLabel}
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            {job.salary.min.toLocaleString()} 〜{" "}
            {job.salary.max.toLocaleString()} 円/月
          </div>
          <Link
            href={`/jobs/${job.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* 横長の企業画像を追加 */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={logoPath}
          alt={company?.name || "企業画像"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-xl font-bold text-white">{job.title}</h2>
          <p className="text-sm text-white mb-2">{company?.name}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
              {employmentTypeLabel}
            </span>
            <span className="px-2 py-1 bg-gray-600/80 text-white text-xs rounded-full">
              {job.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mt-4">
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.preferredSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-gray-700">
            <span className="font-medium">給与: </span>
            {job.salary.min.toLocaleString()} 〜{" "}
            {job.salary.max.toLocaleString()} 円/月
          </div>
          <div className="text-gray-700">
            <span className="font-medium">勤務地: </span>
            {job.location}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">経験: </span>
            {experienceLevelLabel}
          </div>
        </div>

        {job.requiredQuizzes && job.requiredQuizzes.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-md">
            <h3 className="font-medium text-amber-800">応募条件</h3>
            <ul className="mt-1 text-sm text-amber-700">
              {job.requiredQuizzes.map((quiz, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-amber-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  スキルテスト「{quiz.quizId}」で{quiz.minimumScore}
                  %以上のスコア
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            詳細を見る
          </Link>

          {userQuizResults ? (
            isEligible ? (
              <Link
                href={`/jobs/${job.id}/apply`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                応募する
              </Link>
            ) : (
              <div className="flex items-center">
                <span className="text-amber-600 mr-2">
                  必要なスキルテストを完了してください
                </span>
                <Link
                  href="/quizzes"
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200"
                >
                  テストを受ける
                </Link>
              </div>
            )
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              ログインして応募
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
