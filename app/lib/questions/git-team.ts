import { QuizQuestion } from "../definitions";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question:
      "Gitでブランチを作成する主な目的として最も適切なものはどれですか？",
    category: "Gitとチーム開発",
    options: [
      "メインコードに影響を与えずに独立した機能開発やバグ修正を行うため",
      "複数のリポジトリを一つにまとめるため",
      "チームメンバーごとに異なるプログラミング言語を使うため",
      "プロジェクトのバックアップを作成するため",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: "2",
    question:
      "Git Flowにおける「feature」ブランチの役割として正しいものはどれですか？",
    category: "Gitとチーム開発",
    options: [
      "本番環境のバグ修正に使用する",
      "リリース準備に使用する",
      "新機能の開発に使用する",
      "緊急のホットフィックスに使用する",
    ],
    correctAnswerIndex: 2,
  },
  {
    id: "3",
    question: "Gitでコンフリクト（競合）が発生する主な原因は何ですか？",
    category: "Gitとチーム開発",
    options: [
      "リポジトリのサイズが大きすぎる場合",
      "複数の開発者が同じファイルの同じ部分を異なる方法で変更した場合",
      "インターネット接続が不安定な場合",
      "リポジトリに大量のバイナリファイルがある場合",
    ],
    correctAnswerIndex: 1,
  },
  {
    id: "4",
    question:
      "GitHubにおけるPull Requestの主な目的として最も適切なものはどれですか？",
    category: "Gitとチーム開発",
    options: [
      "リモートリポジトリから最新の変更を取得する",
      "ブランチの変更を別のブランチにマージする前に、コードレビューと議論を行う",
      "コードのバックアップを作成する",
      "他のリポジトリからコードをコピーする",
    ],
    correctAnswerIndex: 1,
  },
  {
    id: "5",
    question:
      "チーム開発におけるタスク管理ツール（TrelloやJiraなど）の主な役割として最も適切なものはどれですか？",
    category: "Gitとチーム開発",
    options: [
      "コードの自動生成",
      "プロジェクトのタスクを整理、割り当て、追跡し、進捗を可視化する",
      "サーバーのパフォーマンス監視",
      "自動テストの実行",
    ],
    correctAnswerIndex: 1,
  },
];
