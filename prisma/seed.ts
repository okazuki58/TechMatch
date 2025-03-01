import { PrismaClient } from "@prisma/client";
import { quizData } from "./seedData/quizData";
import { createUserData } from "./seedData/userData";

const prisma = new PrismaClient();

async function main() {
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
