// 求人を取得する関数
export async function getJobs(filters?: {
  companyId?: string;
  experienceLevel?: string;
  employmentType?: string;
}) {
  let url = "/api/jobs";
  const params = new URLSearchParams();

  if (filters) {
    if (filters.companyId) params.append("companyId", filters.companyId);
    if (filters.experienceLevel)
      params.append("experienceLevel", filters.experienceLevel);
    if (filters.employmentType)
      params.append("employmentType", filters.employmentType);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("求人情報の取得に失敗しました");
  }

  return response.json();
}

// 求人詳細を取得する関数
export async function getJobById(jobId: string) {
  const response = await fetch(`/api/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error("求人情報の取得に失敗しました");
  }

  return response.json();
}

// ユーザーのテスト結果に基づいて応募可能な求人を取得する関数
export async function getEligibleJobs() {
  const response = await fetch("/api/jobs/eligible");
  if (!response.ok) {
    throw new Error("応募資格のある求人の取得に失敗しました");
  }

  return response.json();
}
