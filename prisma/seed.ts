const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // 管理者ユーザーを作成
  const adminPassword = await hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: adminPassword,
      role: "admin",
    },
    create: {
      email: "admin@example.com",
      name: "Administrator",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("管理者ユーザーが作成されました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
