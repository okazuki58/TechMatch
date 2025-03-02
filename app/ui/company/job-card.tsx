import Image from "next/image";
import Link from "next/link";
import { Job } from "@/app/lib/definitions";

// 型定義
interface CompanyType {
  id: string;
  name: string;
  logoUrl?: string;
}

type SalaryType = {
  min: number;
  max: number;
  currency: string;
};

interface JobCardProps {
  job: Job;
  company?: CompanyType;
}

export default function JobCard({ job, company }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col">
        {/* 求人画像 - 横長比率に調整 */}
        {job.imageUrl && (
          <Link
            href={`/jobs/${job.id}`}
            className="w-full h-56 relative overflow-hidden block"
          >
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* エクスペリエンスレベルのバッジ */}
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {job.experienceLevel === "entry"
                ? "未経験可"
                : job.experienceLevel === "mid"
                ? "中級者向け"
                : "上級者向け"}
            </div>
          </Link>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/jobs/${job.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors hover:text-blue-700">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center mb-2">
                {company?.logoUrl && (
                  <div className="h-6 w-6 relative mr-2">
                    <Image
                      src={company.logoUrl}
                      alt={company?.name || ""}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <Link
                  href={`/companies/${company?.id}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {company?.name}
                </Link>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {job.salary &&
                  `${(job.salary as SalaryType).min / 10000}〜${
                    (job.salary as SalaryType).max / 10000
                  }万円`}
              </span>
            </div>
          </div>

          {/* タグセクション */}
          <div className="mt-3 mb-4 flex flex-wrap gap-2">
            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
              {job.employmentType === "full-time"
                ? "正社員"
                : job.employmentType === "part-time"
                ? "パートタイム"
                : job.employmentType === "contract"
                ? "契約社員"
                : "インターン"}
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">
              {job.location}
            </span>
            {job.preferredSkills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.preferredSkills.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                +{job.preferredSkills.length - 3}
              </span>
            )}
          </div>

          {/* 説明文（最初の150文字のみ表示） */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {job.description.substring(0, 150)}...
          </p>

          {/* ボタンエリア */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm text-gray-500">
                {new Date(job.postedAt).toLocaleDateString("ja-JP")}に投稿
              </span>
            </div>
            <Link href={`/jobs/${job.id}`}>
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                詳細を見る
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
