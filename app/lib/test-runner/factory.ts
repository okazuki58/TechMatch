import { ExerciseSubmission } from "../definitions";
import { BaseTestRunner } from "./base-runner";
import { TodoAppTestRunner } from "./runners/todo-app-runner";
import path from "path";
import fs from "fs";

export class TestRunnerFactory {
  static async createRunner(
    submission: ExerciseSubmission
  ): Promise<BaseTestRunner> {
    try {
      // 演習設定を読み込む
      const configPath = path.join(
        process.cwd(),
        "app/config/exercises",
        `${submission.exerciseId}.json`
      );

      if (!fs.existsSync(configPath)) {
        throw new Error(`演習設定が見つかりません: ${submission.exerciseId}`);
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const exerciseType = config.type;

      // 演習タイプに応じたランナーを返す
      switch (exerciseType) {
        case "todo-app":
          return new TodoAppTestRunner(submission);
        default:
          throw new Error(`未対応の演習タイプです: ${exerciseType}`);
      }
    } catch (error) {
      throw new Error(
        `テストランナーの作成に失敗しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
    }
  }
}
