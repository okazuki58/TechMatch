import { hash } from "bcrypt";

export const createUserData = async () => {
  return [
    {
      name: "test",
      email: "test@example.com",
      password: await hash("password", 10),
      role: "user",
      // バッジとテスト結果を関連付ける
      quizResults: {
        create: [
          {
            score: 10, // 問題数に応じて適切に設定
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-001" }, // 実際のクイズ名で接続
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-002" },
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-003" },
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-004" },
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-005" },
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-006" },
            },
          },
          {
            score: 10,
            maxScore: 10,
            completedAt: new Date(),
            quiz: {
              connect: { id: "quiz-007" },
            },
          },
        ],
      },
      // バッジはクイズ結果から自動的に作成される仕組みであれば不要
    },
    {
      name: "admin",
      email: "admin@example.com",
      password: await hash("password", 10),
      role: "admin",
    },
  ];
};
