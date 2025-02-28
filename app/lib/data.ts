// app/lib/data.ts
import {
  QuizQuestion,
  Quiz,
  User,
  Badge,
  QuizCategory,
  QuizResult,
} from "./definitions";
import { quizzes } from "./quizzes";

// テストカテゴリ
export const quizCategories: QuizCategory[] = [
  {
    id: "cat-001",
    name: "Web開発",
    description: "Webの仕組みやプロトコル、URLの構造などに関する問題です。",
    imageUrl: "/categories/web-development.svg",
    quizCount: quizzes.filter((q) => q.category === "Web開発").length, // 動的に計算
  },
  {
    id: "cat-002",
    name: "開発プロセス",
    description:
      "バージョン管理システムとチーム開発の基礎知識に関する問題です。",
    imageUrl: "/categories/development-process.svg", // 適切なアイコンに変更
    quizCount: quizzes.filter((q) => q.category === "開発プロセス").length, // 動的に計算
  },
];

// モックユーザーデータ
export const mockUsers: User[] = [
  {
    id: "user-001",
    username: "test_user",
    email: "test@example.com",
    badges: [
      {
        id: "badge-001",
        name: "Web基礎マスター", // 更新: 新しいバッジ名
        description: "Web概論テストで80%以上の正解率を達成", // 更新: 新しい説明
        imageUrl: "/badges/web-basic-badge.svg", // 更新: 新しいバッジ画像
        quizId: "quiz-001",
        achievedAt: new Date("2025-02-25"),
      },
    ],
    quizResults: [
      {
        id: "result-001",
        quizId: "quiz-001",
        quizName: "Web概論テスト", // 更新: 新しいテスト名
        score: 400,
        maxScore: 500,
        completedAt: new Date("2025-02-25"),
      },
    ],
    createdAt: new Date("2025-01-15"),
    lastLogin: new Date("2025-02-26"),
  },
];

// オプション: 2つ目のテストの結果も追加
export const mockUsersWithMultipleResults: User[] = [
  {
    id: "user-002",
    username: "advanced_user",
    email: "advanced@example.com",
    badges: [
      {
        id: "badge-001",
        name: "Web基礎マスター",
        description: "Web概論テストで80%以上の正解率を達成",
        imageUrl: "/badges/web-basic-badge.svg",
        quizId: "quiz-001",
        achievedAt: new Date("2025-02-20"),
      },
      {
        id: "badge-002",
        name: "チーム開発マスター",
        description: "Gitとチーム開発テストで全問正解",
        imageUrl: "/badges/git-team-badge.svg",
        quizId: "quiz-002",
        achievedAt: new Date("2025-02-22"),
      },
    ],
    quizResults: [
      {
        id: "result-001",
        quizId: "quiz-001",
        quizName: "Web概論テスト",
        score: 450,
        maxScore: 500,
        completedAt: new Date("2025-02-20"),
      },
      {
        id: "result-002",
        quizId: "quiz-002",
        quizName: "Gitとチーム開発テスト",
        score: 500,
        maxScore: 500,
        completedAt: new Date("2025-02-22"),
      },
    ],
    createdAt: new Date("2025-01-10"),
    lastLogin: new Date("2025-02-23"),
  },
];

// 現在のユーザー (モック)
export let currentUser: User | null = mockUsers[0];

// モック関数: ユーザーログイン
export const loginUser = (email: string, password: string): User | null => {
  // 実際はパスワード認証などが入る
  const user = mockUsers.find((u) => u.email === email);
  if (user) {
    currentUser = {
      ...user,
      lastLogin: new Date(),
    };
  }
  return currentUser;
};

// モック関数: ユーザーログアウト
export const logoutUser = (): void => {
  currentUser = null;
};

// モック関数: テスト結果の保存とバッジ獲得処理
export const saveQuizResult = (
  quizId: string,
  score: number,
  maxScore: number
): { quizResult: QuizResult; newBadge: Badge | null } => {
  if (!currentUser) {
    throw new Error("ユーザーがログインしていません");
  }

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) {
    throw new Error("テストが見つかりません");
  }

  // 結果を作成
  const quizResult = {
    id: `result-${Date.now()}`,
    quizId,
    quizName: quiz.name,
    score,
    maxScore,
    completedAt: new Date(),
  };

  // ユーザーに結果を追加
  currentUser.quizResults.push(quizResult);

  // バッジ処理
  let newBadge: Badge | null = null;
  const scorePercentage = (score / maxScore) * 100;

  // すでにバッジを持っているか確認
  const hasBadge = currentUser.badges.some((b) => b.quizId === quizId);

  // バッジ獲得条件: テストによって異なる
  let badgeEarned = false;

  if (quizId === "quiz-001" && scorePercentage >= 80) {
    badgeEarned = true;
  } else if (quizId === "quiz-002" && scorePercentage === 100) {
    badgeEarned = true;
  } else if (quizId === "quiz-003" && scorePercentage >= 80) {
    badgeEarned = true;
  }

  // 新しいバッジを獲得した場合
  if (badgeEarned && !hasBadge) {
    newBadge = {
      id: `badge-${Date.now()}`,
      name: quiz.badge.name,
      description: quiz.badge.description,
      imageUrl: quiz.badge.imageUrl,
      quizId: quiz.id,
      achievedAt: new Date(),
    };

    currentUser.badges.push(newBadge);
  }

  return { quizResult, newBadge };
};
