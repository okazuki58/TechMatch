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

    // 親テーブルを削除
    prisma.exercise.deleteMany({}),
    prisma.quiz.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  console.log("データベースをリセットしました");


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

  // クイズデータの作成
  console.log("クイズデータを作成中...");
  for (const quiz of quizData) {
    await prisma.quiz.create({
      data: quiz,
    });
  }
  console.log(`${quizData.length}件のクイズデータを作成しました`);

  // 演習データの作成
  console.log("演習データを作成中...");
  for (const exercise of exerciseData) {
    await prisma.exercise.create({
      data: exercise,
    });
  }
  console.log(`${exerciseData.length}件の演習データを作成しました`);
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
