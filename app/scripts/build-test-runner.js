import { execSync } from "child_process";
import path from "path";

// テストランナーディレクトリ
const testRunnerDir = path.join(__dirname, "../test-runner");

// Dockerイメージをビルド
console.log("Building Docker test runner image...");
execSync("docker build -t puppeteer-test-runner .", {
  cwd: testRunnerDir,
  stdio: "inherit",
});

console.log("Docker image built successfully!");
