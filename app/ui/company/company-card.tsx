import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Company } from "@/app/lib/definitions";

interface CompanyCardProps {
  company: Company;
  showJobCount?: boolean;
}

export default function CompanyCard({
  company,
  showJobCount = false,
}: CompanyCardProps) {
  const logoPath =
    company.logoUrl ||
    `/company/company0${(parseInt(company.id.split("-")[1]) % 4) + 1}.jpg`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      <Link href={`/companies/${company.id}`} className="block">
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={logoPath}
            alt={`${company.name}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6">
          <div className="flex items-start">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
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
                    className="h-8 w-8"
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
              <h2 className="text-xl font-bold text-gray-900">
                {company.name}
              </h2>
              <p className="mt-1 text-gray-600 line-clamp-2">
                {company.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {company.industry}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {company.location}
                </span>
                {showJobCount && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    求人 {company.jobCount || 0}件
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
