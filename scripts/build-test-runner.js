import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// テストランナーディレクトリ
const runnersDir = path.join(process.cwd(), "docker/test-runners");

// 利用可能なランナーを検出
const runners = fs
  .readdirSync(runnersDir)
  .filter((dir) => fs.existsSync(path.join(runnersDir, dir, "Dockerfile")));

console.log("Building test runner images...");

// 各ランナーのDockerイメージをビルド
for (const runner of runners) {
  const runnerDir = path.join(runnersDir, runner);
  const imageName = `${runner}-test-runner`;

  console.log(`Building ${imageName}...`);

  try {
    execSync(`docker build -t ${imageName} ${runnerDir}`, {
      stdio: "inherit",
    });
    console.log(`Successfully built ${imageName}`);
  } catch (error) {
    console.error(`Failed to build ${imageName}:`, error.message);
    // 開発環境なのでエラーを致命的にはしない
    // プロセスは継続
  }
}

console.log("All test runner images built");
