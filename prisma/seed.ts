import { PrismaClient } from "@prisma/client";
import { quizData } from "./seedData/quizData";
import { createUserData } from "./seedData/userData";
import { exerciseData } from "./seedData/exerciseData";

const prisma = new PrismaClient();

async function main() {
  console.log("データベースをリセット中...");

  // トランザクション内で外部キー制約を無視して削除
  await prisma.$transaction([
    // 子テーブルから削除
    prisma.quizResult.deleteMany({}),
    prisma.exerciseSubmission.deleteMany({}),
    prisma.badge.deleteMany({}),

    // 中間テーブル
    prisma.quizBadge.deleteMany({}),

    // 親テーブルを削除
    prisma.exercise.deleteMany({}),
    prisma.quiz.deleteMany({}),
    prisma.user.deleteMany({}),

    // その他すべてのテーブル（存在する場合）
    prisma.$queryRaw`TRUNCATE TABLE "Session" CASCADE;`,
    prisma.$queryRaw`TRUNCATE TABLE "Account" CASCADE;`,
    prisma.$queryRaw`TRUNCATE TABLE "VerificationToken" CASCADE;`,
  ]);

  console.log("データベースをリセットしました");

  // クイズデータの作成
  console.log("クイズデータを作成中...");
  for (const quiz of quizData) {
    await prisma.quiz.create({
      data: quiz,
    });
  }
  console.log(`${quizData.length}件のクイズデータを作成しました`);

  // ユーザーデータの作成
  console.log("ユーザーデータを作成中...");
  const userData = await createUserData();

  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`${userData.length}件のユーザーデータを作成しました`);

  // 演習データの作成
  console.log("演習データを作成中...");
  for (const exercise of exerciseData) {
    await prisma.exercise.create({
      data: exercise,
    });
  }
  console.log(`${exerciseData.length}件の演習データを作成しました`);

  // testユーザーの全クイズ結果を満点で登録
  console.log("テストユーザーのクイズ結果を作成中...");
  const testUser = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  if (testUser) {
    const quizzes = await prisma.quiz.findMany({
      include: { badge: true },
    });

    for (const quiz of quizzes) {
      // クイズ結果作成
      await prisma.quizResult.create({
        data: {
          userId: testUser.id,
          quizId: quiz.id,
          score: 100, // 満点
          maxScore: 100,
          completedAt: new Date(),
        },
      });

      // バッジ作成
      if (quiz.badge) {
        await prisma.badge.create({
          data: {
            userId: testUser.id,
            quizId: quiz.id,
            name: quiz.badge.name,
            description: quiz.badge.description,
            imageUrl: quiz.badge.imageUrl,
            achievedAt: new Date(),
          },
        });
      }
    }
    console.log(`${quizzes.length}件のクイズ結果とバッジを作成しました`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
