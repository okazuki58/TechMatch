import { ExerciseSubmission, TestResult } from "./definitions";

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

## 技術的要件（自動テストのため）

以下の要素とクラス名を使用してください：

- 入力フィールド: \`<input id="todo-input">\`
- 追加ボタン: \`<button id="add-button">\`
- Todoリスト: \`<ul id="todo-list">\`
- Todoアイテム: \`<li class="todo-item">\`
- Todoテキスト: \`<span class="todo-text">\`
- 完了状態のクラス: \`class="completed"\`
- 削除ボタン: \`<button class="delete-btn">\`

## 機能の詳細

1. 入力フィールドにテキストを入力し、追加ボタンをクリックするとタスクが追加される
2. タスクのテキスト部分をクリックすると、完了/未完了状態が切り替わる（完了状態では取り消し線が表示される）
3. 削除ボタンをクリックすると、タスクが削除される
4. ページを再読み込みしても、タスクが保持される（LocalStorageを使用）

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

## 提出方法

完成したコードをGitHubリポジトリにプッシュし、リポジトリのURLを提出してください。
自動テストが実行され、結果が表示されます。
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

// クライアントサイドから呼び出すAPI関数
export async function submitExercise(
  userId: string,
  exerciseId: string,
  repositoryUrl: string
): Promise<ExerciseSubmission> {
  const response = await fetch("/api/exercises/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      exerciseId,
      repositoryUrl,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "リポジトリの提出に失敗しました");
  }

  const data = await response.json();
  return data.submission;
}

// テスト結果を取得する関数
export async function getTestResults(
  submissionId: string
): Promise<TestResult | null> {
  const response = await fetch(
    `/api/exercises/results?submissionId=${submissionId}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.result;
}
