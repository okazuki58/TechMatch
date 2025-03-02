import { ExerciseSubmission, TestResult } from "./definitions";

// 演習データ
export const exercises = [
  {
    id: "ex-001",
    title: "シンプルなTodoアプリ",
    description: "HTML, CSS, JavaScriptを使用した基本的なTodoアプリを作成する演習です。",
    difficulty: "beginner",
    category: "frontend",
    tags: ["html", "css", "javascript"],
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

## 要件

1. **タスクの追加**: 入力フィールドにテキストを入力し、追加ボタンをクリックするとリストに追加される
2. **タスクの完了/未完了**: タスクをクリックすると、取り消し線で完了/未完了を切り替えられる
3. **タスクの削除**: 削除ボタンをクリックするとタスクが削除される

## 技術的要件（自動テストのため）

以下の要素とクラス名を使用してください：

- 入力フィールド: \`<input id="todo-input">\`
- 追加ボタン: \`<button id="add-button">\`
- Todoリスト: \`<ul id="todo-list">\`
- Todoアイテム: \`<li class="todo-item">\`
- Todoテキスト: \`<span class="todo-text">\`
- 完了状態のクラス: <code><strong>class="completed"</strong></code>
- 削除ボタン: \`<button class="delete-btn">\`

## 開発手順

1. 新しいプロジェクトディレクトリを作成:

\`\`\`bash
mkdir my-todo-app
cd my-todo-app
\`\`\`

2. 必要なファイルを作成:
   - index.html
   - styles.css
   - script.js

3. 要件に沿ってTodoアプリを実装してください

## 提出方法

1. 実装したコードをGitHubリポジトリにプッシュ:

\`\`\`bash
git init
git add .
git commit -m "Implement Todo app"
git remote add origin https://github.com/あなたのユーザー名/あなたのリポジトリ名.git
git push -u origin main
\`\`\`

2. リポジトリのURLを提出フォームに貼り付けて提出
  `;
}

export async function getExerciseById(id: string) {
  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) return null;

  // 代わりに静的なコンテンツを使用
  const instructions = getFallbackMarkdown(id);

  return {
    ...exercise,
    instructions,
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
