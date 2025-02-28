import { Exercise, ExerciseSubmission, TestResult } from "./definitions";

// 演習データ
export const exercises = [
  {
    id: "ex-001",
    title: "シンプルなTodoアプリ",
    description: "Reactを使用した基本的なTodoアプリを作成する演習です。",
    difficulty: "beginner",
    category: "frontend",
    tags: ["react", "javascript", "state-management"],
    testDescription:
      "テストでは、Todoアイテムの追加、切り替え、削除、フィルタリングの各機能が正しく動作するかを検証します。",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  // 他の演習データ
];

// 演習の取得関数
export async function getExercises() {
  return exercises;
}

// マークダウンのフォールバックデータを返す
function getFallbackMarkdown(exerciseId: string) {
  // 既存の演習データから該当する演習を探す
  const exercise = exercises.find((ex) => ex.id === exerciseId);
  if (!exercise) return "";

  // ここに既存のマークダウンテキストを返す
  return `
# ${exercise.title}

${exercise.description}

## 要件

1. Todoアイテムの追加機能を実装する
2. Todoアイテムの完了/未完了の切り替え機能を実装する
3. Todoアイテムの削除機能を実装する

## セットアップ手順

1. リポジトリをクローン:

\`\`\`bash
git clone https://github.com/your-username/todo-app-exercise.git
cd todo-app-exercise
\`\`\`

2. 依存関係をインストール:

\`\`\`bash
npm install
\`\`\`

3. 開発サーバーを起動:

\`\`\`bash
npm start
\`\`\`
  `;
}

// セットアップガイドを取得
function getSetupGuide(exerciseId: string) {
  const exercise = exercises.find((ex) => ex.id === exerciseId);
  if (!exercise) return "";

  return `
# ${exercise.title} セットアップガイド

## 開発環境のセットアップ

1. Node.jsとnpmがインストールされていることを確認してください

2. リポジトリをクローン:

\`\`\`bash
git clone https://github.com/example/${exerciseId}.git
cd ${exerciseId}
\`\`\`

3. 依存関係をインストール:

\`\`\`bash
npm install
\`\`\`

4. 開発サーバーを起動:

\`\`\`bash
npm start
\`\`\`

## テストの実行方法

\`\`\`bash
npm test
\`\`\`
  `;
}

export async function getExerciseById(id: string) {
  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) return null;

  // 代わりに静的なコンテンツを使用
  const instructions = getFallbackMarkdown(id);
  const setupGuide = getSetupGuide(id);

  return {
    ...exercise,
    instructions,
    setupGuide,
  };
}

// 演習提出関数
export async function submitExercise(
  userId: string,
  exerciseId: string,
  repositoryUrl: string
): Promise<ExerciseSubmission> {
  // 演習提出の処理（既存のコード）
  const submission: ExerciseSubmission = {
    id: `sub-${Date.now().toString()}`,
    userId,
    exerciseId,
    repositoryUrl,
    status: "pending",
    submittedAt: new Date(),
    results: null,
  };

  // TODO: データベースに提出を保存

  return submission;
}

// テスト結果を取得する関数
export async function getTestResults(
  submissionId: string
): Promise<TestResult | null> {
  // 実際のプロジェクトではAPIやデータベースからデータを取得
  // ここではダミーデータを返す
  return {
    id: `test-${submissionId}`,
    submissionId: submissionId,
    exerciseId: "ex-001",
    userId: "user-123",
    passed: true,
    score: 8,
    maxScore: 10,
    details: [
      {
        testName: "Todoアイテムの追加",
        passed: true,
        message: "テスト成功",
        expected: "期待値",
        actual: "実際の値",
      },
      {
        testName: "Todoアイテムの切り替え",
        passed: true,
        message: "テスト成功",
      },
      {
        testName: "Todoアイテムの削除",
        passed: false,
        message: "テスト失敗: 削除後もアイテムが残っています",
      },
    ],
    feedback: "良い実装です。Todoアイテムの削除機能を修正してください。",
    completedAt: new Date(),
  };
}
