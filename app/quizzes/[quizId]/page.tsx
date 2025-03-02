"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, QuizResult, QuizState, Quiz } from "@/app/lib/definitions";
import { useAuth } from "@/app/lib/contexts/auth-context";
import QuizCard from "@/app/ui/quiz-card";
import Header from "@/app/ui/header";
import Navbar from "@/app/ui/navbar";
import QuizResultScreen from "@/app/ui/quiz-result";
import Link from "next/link";
import React from "react";

export default function QuizPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // クイズの状態管理
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedOptionIndex: null,
    isAnswerEvaluated: false,
    questions: [],
  });

  // クイズデータの取得
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quizzes/${params.quizId}`);
        if (!response.ok) {
          throw new Error("クイズの取得に失敗しました");
        }
        const data = await response.json();
        setQuiz(data);
        setQuizState((prev) => ({
          ...prev,
          questions: data.questions || [],
        }));
      } catch (error) {
        console.error("クイズの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [params.quizId]);

  // 選択肢を選んだときの処理
  const handleSelectOption = (index: number) => {
    // 解答表示後は選択できないようにする
    if (quizState.isAnswerEvaluated) return;

    setQuizState((prev) => ({
      ...prev,
      selectedOptionIndex: index,
    }));
  };

  // 回答を提出して採点する処理
  const handleSubmitAnswer = () => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect =
      quizState.selectedOptionIndex === currentQuestion.correctAnswerIndex;
    const isLastQuestion =
      quizState.currentQuestionIndex === quizState.questions.length - 1;

    // 新しいスコアを計算
    const newScore = isCorrect ? quizState.score + 10 : quizState.score;

    // 状態を更新
    setQuizState((prev) => ({
      ...prev,
      score: newScore,
      isAnswerEvaluated: true,
    }));

    // 最後の問題なら、この場で結果を確定して表示
    if (isLastQuestion) {
      // 最新のスコアで結果を作成して保存
      saveQuizResult({
        quizId: quiz?.id,
        score: newScore,
        maxScore: quizState.questions.length * 10,
        completedAt: new Date(),
      });
    }
  };

  // 2. 新しいヘルパー関数を追加
  const saveQuizResult = async (result: {
    quizId: string | undefined;
    score: number;
    maxScore: number;
    completedAt: Date;
  }) => {
    try {
      const response = await fetch("/api/quizzes/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = await response.json();
      if (response.ok) {
        setQuizResult(data.quizResult);
        setNewBadge(data.newBadge);
        setQuizEnded(true);
      }
    } catch (error) {
      console.error("結果保存エラー:", error);
      // エラー時のフォールバック
      setQuizResult({
        id: `temp-${Date.now()}`,
        quizId: quiz?.id ?? "",
        quizName: quiz?.name ?? "",
        score: result.score,
        maxScore: result.maxScore,
        completedAt: result.completedAt,
      });
      setQuizEnded(true);
    }
  };

  // 次の問題に進む処理
  const handleNextQuestion = () => {
    const isLastQuestion =
      quizState.currentQuestionIndex === quizState.questions.length - 1;

    if (!isLastQuestion) {
      // 最後の問題でなければ次へ
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOptionIndex: null,
        isAnswerEvaluated: false,
      }));
    }
    // 最後の問題の場合は何もしない（handleSubmitAnswerで処理済み）
  };

  // 結果画面から次へ進むときの処理
  const handleContinueAfterResult = async () => {
    if (user) {
      // セッションを更新してからリダイレクト
      await fetch("/api/auth/session?update=true");
      router.push("/profile");
    } else {
      router.push("/quizzes");
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </>
    );
  }

  // テストが見つからない場合
  if (!quiz) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
          <h1 className="text-3xl font-bold mb-6">テストが見つかりません</h1>
          <p className="mb-6">
            指定されたテストIDが存在しないか、削除された可能性があります。
          </p>
          <Link href="/quizzes" className="btn btn-primary">
            テスト一覧に戻る
          </Link>
        </div>
      </>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress =
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {!quizEnded && (
          <div className="mb-6">
            <Link
              href="/quizzes"
              className="text-blue-600 hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              テスト一覧に戻る
            </Link>
            <h1 className="text-2xl font-bold mt-3">{quiz.name}</h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="mr-3">カテゴリ: {quiz.category}</span>
              <span>
                難易度:
                {quiz.difficulty === "easy" && "初級"}
                {quiz.difficulty === "medium" && "中級"}
                {quiz.difficulty === "hard" && "上級"}
              </span>
            </div>
          </div>
        )}

        {quizEnded && quizResult ? (
          <QuizResultScreen
            result={quizResult}
            badge={newBadge}
            onContinue={handleContinueAfterResult}
          />
        ) : (
          <>
            <Header
              score={quizState.score}
              currentQuestionIndex={quizState.currentQuestionIndex}
              totalQuestions={quizState.questions.length}
              progress={progress}
              showProgress={true}
            />

            <QuizCard
              question={currentQuestion}
              selectedOptionIndex={quizState.selectedOptionIndex}
              isAnswerEvaluated={quizState.isAnswerEvaluated}
              onSelectOption={handleSelectOption}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
              isLastQuestion={
                quizState.currentQuestionIndex ===
                quizState.questions.length - 1
              }
            />

            {!user && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>ログインするとバッジが獲得できます！</strong>{" "}
                  テストの進捗や結果を保存して、友達とシェアしましょう。
                </p>
                <div className="mt-2 flex space-x-3">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-sm text-blue-600 font-medium"
                  >
                    ログイン
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="text-sm text-blue-600 font-medium"
                  >
                    新規登録
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
