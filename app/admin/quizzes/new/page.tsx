"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { quizCategories } from "@/app/lib/data";

type Question = {
  question: string;
  category: string;
  options: string[];
  correctAnswerIndex: number;
};

export default function NewQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quiz, setQuiz] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "medium",
  });

  const [badge, setBadge] = useState({
    name: "",
    description: "",
    imageUrl: "/badges/default-badge.svg",
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);

  const handleQuizChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleBadgeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBadge({ ...badge, [name]: value });
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | string[] | number
  ) => {
    const newQuestions = [...questions];
    if (field === "correctAnswerIndex") {
      newQuestions[index].correctAnswerIndex = value as number;
    } else if (field === "options") {
      newQuestions[index].options = value as string[];
    } else if (field === "question") {
      newQuestions[index].question = value as string;
    } else if (field === "category") {
      newQuestions[index].category = value as string;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswerIndex = parseInt(value.toString());
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        category: quiz.category,
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
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
        throw new Error("クイズの作成に失敗しました");
      }

      router.push("/admin/quizzes");
    } catch (error) {
      console.error("エラー:", error);
      alert("クイズの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">新規クイズ作成</h1>
        <Link href="/admin/quizzes" className="text-blue-600 hover:underline">
          クイズ一覧に戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* クイズ基本情報 */}
        <div className="bg-white p-6 rounded-lg shadow">
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                カテゴリ
              </label>
              <select
                name="category"
                value={quiz.category}
                onChange={handleQuizChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">カテゴリを選択</option>
                {quizCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                難易度
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleQuizChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="easy">初級</option>
                <option value="medium">中級</option>
                <option value="hard">上級</option>
              </select>
            </div>
          </div>
        </div>

        {/* バッジ情報 */}
        <div className="bg-white p-6 rounded-lg shadow">
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                バッジ説明
              </label>
              <input
                type="text"
                name="description"
                value={badge.description}
                onChange={handleBadgeChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 問題 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">問題</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              問題を追加
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">問題 {qIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-900"
                  disabled={questions.length <= 1}
                >
                  削除
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    問題文
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    カテゴリ
                  </label>
                  <select
                    value={question.category}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "category", e.target.value)
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">カテゴリを選択</option>
                    {quizCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    選択肢
                  </label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswerIndex === oIndex}
                        onChange={() =>
                          handleCorrectAnswerChange(qIndex, oIndex)
                        }
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        required
                        placeholder={`選択肢 ${oIndex + 1}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <p className="text-sm text-gray-500 mt-1">
                    ※ 正解の選択肢にチェックを入れてください
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "保存中..." : "クイズを保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
