import { Quiz } from "./definitions";
import { quizQuestions as webBasicsQuestions } from "./questions/web-basics";
import { quizQuestions as gitTeamQuestions } from "./questions/git-team";

export const quizzes: Quiz[] = [
  {
    id: "quiz-001",
    name: "Web概論クイズ",
    description:
      "Webの基本的な仕組みやプロトコル、URLの構造などに関する問題です。",
    category: "Web開発",
    difficulty: "easy",
    questions: webBasicsQuestions,
    badge: {
      name: "Web基礎マスター",
      description: "Web概論クイズで80%以上の正解率を達成",
      imageUrl: "/badges/web-basic-badge.svg",
    },
  },
  {
    id: "quiz-002",
    name: "Gitとチーム開発クイズ",
    description:
      "バージョン管理システムとチーム開発の基礎知識に関する問題です。",
    category: "開発プロセス",
    difficulty: "medium",
    questions: gitTeamQuestions,
    badge: {
      name: "チーム開発マスター",
      description: "Gitとチーム開発クイズで全問正解",
      imageUrl: "/badges/git-team-badge.svg",
    },
  },
];
