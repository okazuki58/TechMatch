import { Job } from "./definitions";

// モック求人データ
export const mockJobs: Job[] = [
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
    postedAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01"),
    isActive: true,
  },
  {
    id: "job-002",
    companyId: "company-002",
    title: "バックエンドエンジニア（未経験可）",
    description:
      "Node.jsを使用したAPIの開発を担当していただきます。未経験でもプログラミングの基礎知識があれば応募可能です。",
    requirements: ["JavaScriptの基本的な知識", "プログラミングの基礎知識"],
    preferredSkills: ["Node.js", "Express", "データベース（MongoDB, MySQL等）"],
    location: "大阪（週2出社）",
    employmentType: "full-time",
    experienceLevel: "entry",
    salary: {
      min: 300000,
      max: 500000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-001",
        minimumScore: 60,
      },
    ],
    postedAt: new Date("2025-02-28"),
    updatedAt: new Date("2025-02-28"),
    isActive: true,
  },
];

// 求人を取得する関数
export function getJobs(filters?: {
  companyId?: string;
  experienceLevel?: string;
  employmentType?: string;
}) {
  let filteredJobs = [...mockJobs];

  if (filters) {
    if (filters.companyId) {
      filteredJobs = filteredJobs.filter(
        (job) => job.companyId === filters.companyId
      );
    }
    if (filters.experienceLevel) {
      filteredJobs = filteredJobs.filter(
        (job) => job.experienceLevel === filters.experienceLevel
      );
    }
    if (filters.employmentType) {
      filteredJobs = filteredJobs.filter(
        (job) => job.employmentType === filters.employmentType
      );
    }
  }

  return filteredJobs;
}

// 求人詳細を取得する関数
export function getJobById(jobId: string) {
  return mockJobs.find((job) => job.id === jobId) || null;
}

// ユーザーのテスト結果に基づいて応募可能な求人を取得する関数
export function getEligibleJobs(
  userQuizResults: {
    quizId: string;
    score: number;
    maxScore: number;
  }[]
) {
  return mockJobs.filter((job) => {
    // 必須テストがない場合は応募可能
    if (!job.requiredQuizzes || job.requiredQuizzes.length === 0) {
      return true;
    }

    // すべての必須テストで最低スコアを満たしているか確認
    return job.requiredQuizzes.every((requiredQuiz) => {
      const userResult = userQuizResults.find(
        (result) => result.quizId === requiredQuiz.quizId
      );
      if (!userResult) return false;

      const percentageScore = (userResult.score / userResult.maxScore) * 100;
      return percentageScore >= requiredQuiz.minimumScore;
    });
  });
}
