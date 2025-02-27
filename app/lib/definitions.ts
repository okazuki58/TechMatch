// 既存のQuiz定義
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

// クイズカテゴリの型定義
export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quizCount: number;
}

// クイズコレクションの型定義
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
