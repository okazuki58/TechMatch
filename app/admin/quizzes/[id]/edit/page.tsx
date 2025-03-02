"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quiz, setQuiz] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "easy",
  });
  const [badge, setBadge] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [questions, setQuestions] = useState<
    Array<{
      id?: string;
      question: string;
      category: string;
      options: string[];
      correctAnswerIndex: number;
    }>
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    category: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
  });

  // クイズデータを取得
  useEffect(() => {
    async function fetchQuizData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error("クイズの取得に失敗しました");
        }

        const data = await response.json();

        // 取得したデータで状態を更新
        setQuiz({
          name: data.name,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
        });

        if (data.badge) {
          setBadge({
            name: data.badge.name,
            description: data.badge.description,
            imageUrl: data.badge.imageUrl,
          });
        }

        if (data.questions) {
          setQuestions(
            data.questions.map(
              (q: {
                id: string;
                question: string;
                category: string;
                options: string[];
                correctAnswerIndex: number;
              }) => ({
                id: q.id,
                question: q.question,
                category: q.category,
                options: q.options,
                correctAnswerIndex: q.correctAnswerIndex,
              })
            )
          );
        }
      } catch (error) {
        console.error("クイズデータの取得エラー:", error);
        alert("クイズデータの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizData();
  }, [quizId]);

  // クイズ情報の更新
  const handleQuizChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  // バッジ情報の更新
  const handleBadgeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBadge((prev) => ({ ...prev, [name]: value }));
  };

  // 問題入力の更新
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // 選択肢の更新
  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  // 正解選択肢の更新
  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      correctAnswerIndex: parseInt(e.target.value),
    }));
  };

  // 問題の追加
  const handleAddQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.category) {
      alert("問題と分類を入力してください");
      return;
    }

    if (currentQuestion.options.some((option) => !option)) {
      alert("すべての選択肢を入力してください");
      return;
    }

    setQuestions((prev) => [...prev, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    });
  };

  // 問題の削除
  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // 問題の編集
  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    handleRemoveQuestion(index);
  };

  // フォームの送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // バリデーション
    if (!quiz.name || !quiz.description || !quiz.category) {
      alert("クイズの基本情報を入力してください");
      setIsSubmitting(false);
      return;
    }

    if (!badge.name || !badge.description || !badge.imageUrl) {
      alert("バッジ情報を入力してください");
      setIsSubmitting(false);
      return;
    }

    if (questions.length === 0) {
      alert("少なくとも1つの問題を追加してください");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz,
          badge,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error("クイズの更新に失敗しました");
      }

      router.push("/admin/quizzes");
    } catch (error) {
      console.error("エラー:", error);
      alert("クイズの更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">クイズ編集</h1>
        <Link href="/admin/quizzes" className="text-blue-600 hover:underline">
          クイズ一覧に戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* クイズ基本情報 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                クイズ名
              </label>
              <input
                type="text"
                name="name"
                value={quiz.name}
                onChange={handleQuizChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                name="description"
                value={quiz.description}
                onChange={handleQuizChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                カテゴリ
              </label>
              <input
                type="text"
                name="category"
                value={quiz.category}
                onChange={handleQuizChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                難易度
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleQuizChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="easy">初級</option>
                <option value="medium">中級</option>
                <option value="hard">上級</option>
              </select>
            </div>
          </div>
        </div>

        {/* バッジ情報 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">バッジ情報</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                バッジ名
              </label>
              <input
                type="text"
                name="name"
                value={badge.name}
                onChange={handleBadgeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                バッジ説明
              </label>
              <textarea
                name="description"
                value={badge.description}
                onChange={handleBadgeChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                バッジ画像URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={badge.imageUrl}
                onChange={handleBadgeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 問題一覧 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">問題一覧</h2>

          {questions.length > 0 ? (
            <div className="space-y-4 mb-6">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="border p-4 rounded-md bg-gray-50 relative"
                >
                  <h3 className="font-medium">
                    {idx + 1}. {q.question}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    分類: {q.category}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`text-sm ${
                          optIdx === q.correctAnswerIndex
                            ? "text-green-600 font-medium"
                            : ""
                        }`}
                      >
                        {optIdx === q.correctAnswerIndex ? "✓ " : ""}
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(idx)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">問題がまだありません</p>
          )}

          {/* 新規問題追加フォーム */}
          <div className="border p-4 rounded-md">
            <h3 className="font-medium mb-3">新規問題</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  問題文
                </label>
                <textarea
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  分類
                </label>
                <input
                  type="text"
                  name="category"
                  value={currentQuestion.category}
                  onChange={handleQuestionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選択肢
                </label>
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={idx}
                      checked={currentQuestion.correctAnswerIndex === idx}
                      onChange={handleCorrectAnswerChange}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={`選択肢 ${idx + 1}`}
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-1">
                  ※ 正解の選択肢を選んでください
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  問題を追加
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {isSubmitting ? "更新中..." : "クイズを更新"}
          </button>
        </div>
      </form>
    </div>
  );
}
