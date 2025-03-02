// prisma/seedData/jobData.ts
export const jobData = [
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
    imageUrl: "/jobs/job01.jpg",
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
    imageUrl: "/jobs/job02.jpg",
  },
  {
    id: "job-003",
    companyId: "company-003",
    title: "データサイエンティスト",
    description:
      "ビッグデータの分析と機械学習モデルの構築を担当。事業の意思決定をデータで支援します。",
    requirements: [
      "Pythonでのデータ分析経験（3年以上）",
      "機械学習アルゴリズムの知識と実装経験",
      "SQLを用いたデータ集計・加工",
    ],
    preferredSkills: ["PyTorch/TensorFlow", "R言語", "データ可視化", "統計学"],
    location: "東京（週3リモート）",
    employmentType: "full-time",
    experienceLevel: "senior",
    salary: {
      min: 800000,
      max: 1200000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-002",
        minimumScore: 80,
      },
    ],
    postedAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05"),
    isActive: true,
    imageUrl: "/jobs/job03.jpg",
  },
  {
    id: "job-004",
    companyId: "company-004",
    title: "モバイルアプリ開発者",
    description:
      "Flutterを使用したクロスプラットフォームアプリ開発を担当。新規サービスの立ち上げから参加できます。",
    requirements: [
      "モバイルアプリ開発経験（1年以上）",
      "Dartの基本的な知識",
      "UIデザインへの理解",
    ],
    preferredSkills: [
      "Flutter",
      "Firebase",
      "iOS/Android ネイティブ開発",
      "CI/CD",
    ],
    location: "リモートワーク（月1回東京オフィス出社）",
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 500000,
      max: 800000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-003",
        minimumScore: 65,
      },
    ],
    postedAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-12"),
    isActive: true,
    imageUrl: "/jobs/job04.jpg",
  },
  {
    id: "job-005",
    companyId: "company-005",
    title: "DevOpsエンジニア",
    description:
      "クラウドインフラの構築・運用とCI/CDパイプラインの整備を担当。開発チームの生産性向上に貢献します。",
    requirements: [
      "AWSまたはGCPの基本的な知識",
      "GitHubActionsやJenkinsなどのCI/CDツールの経験",
      "Linux環境での作業経験",
    ],
    preferredSkills: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "監視ツール（Prometheus等）",
    ],
    location: "福岡（フルリモート可）",
    employmentType: "contract",
    experienceLevel: "mid",
    salary: {
      min: 600000,
      max: 900000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-004",
        minimumScore: 70,
      },
    ],
    postedAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
    isActive: true,
    imageUrl: "/jobs/job05.jpg",
  },
];
