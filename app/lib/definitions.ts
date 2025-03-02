///////////// テストの型定義 /////////////
export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  selectedOptionIndex: number | null;
  showAnswer: boolean;
  timeRemaining: number;
  questions: QuizQuestion[];
}

// ユーザー関連の型定義
export interface User {
  id: string;
  username: string;
  email: string;
  badges: Badge[];
  quizResults: QuizResult[];
  createdAt: Date;
  lastLogin: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quizId: string;
  achievedAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizName: string;
  score: number;
  maxScore: number;
  completedAt: Date;
}

// テストカテゴリの型定義
export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quizCount: number;
}

// テストコレクションの型定義
export interface Quiz {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  badge: {
    name: string;
    description: string;
    imageUrl: string;
  };
}

///////////// 求人の型定義 /////////////
export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  employeeCount: number;
  websiteUrl: string;
  logoUrl: string;
  about?: string;
  jobCount?: number;
  createdAt: Date;
}

// 求人の型定義
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  location: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel: "entry" | "mid" | "senior";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requiredQuizzes?: {
    quizId: string;
    minimumScore: number;
  }[];
  postedAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// 応募の型定義
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewing" | "interviewed" | "offered" | "rejected";
  quizResults: {
    quizId: string;
    score: number;
    maxScore: number;
    completedAt: Date;
  }[];
  coverLetter?: string;
  appliedAt: Date;
  updatedAt: Date;
}

// ユーザー型定義の拡張
export interface User {
  // ... 既存のプロパティ
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
  }[];
  jobApplications?: JobApplication[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: string; // "beginner" | "intermediate" | "advanced" から変更
  category: string;
  tags: string[];
  testDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  instructions?: string;
  setupGuide?: string;
  gifUrl?: string | null;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  repositoryUrl: string;
  status: "pending" | "testing" | "completed" | "failed";
  submittedAt: Date;
  results: TestResult | null;
}

export interface TestResult {
  id: string;
  submissionId: string;
  exerciseId: string;
  userId: string;
  passed: boolean;
  score: number;
  maxScore: number;
  details: TestDetail[];
  feedback: string;
  completedAt: Date;
  createdAt: Date;
  status: string;
}

export interface TestDetail {
  testName: string;
  passed: boolean;
  message: string;
  expected?: string;
  actual?: string;
}
