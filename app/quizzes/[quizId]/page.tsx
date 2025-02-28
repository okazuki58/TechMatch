"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, QuizResult, QuizState } from "@/app/lib/definitions";
import { useAuth } from "@/app/lib/contexts/auth-context";
import QuizCard from "@/app/ui/quiz-card";
import Header from "@/app/ui/header";
import Navbar from "@/app/ui/navbar";
import QuizResultScreen from "@/app/ui/quiz-result";
import Link from "next/link";
import { quizzes } from "@/app/lib/quizzes";
import React from "react";

export default function QuizPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // テストデータの取得
  const quiz = quizzes.find((q) => q.id === params.quizId);

  // すべてのuseStateとuseEffectをコンポーネントのトップレベルに配置
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedOptionIndex: null,
    showAnswer: false,
    timeRemaining: 20,
    questions: quiz?.questions || [],
  });

  // quizが変更されたときに質問を更新
  useEffect(() => {
    if (quiz) {
      setQuizState((prev) => ({
        ...prev,
        questions: quiz.questions,
      }));
    }
  }, [quiz]);

  useEffect(() => {
    if (!quiz) return;

    if (quizState.timeRemaining > 0 && !quizState.showAnswer) {
      const timer = setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (quizState.timeRemaining === 0 && !quizState.showAnswer) {
      // 時間切れの場合は解答を表示
      setQuizState((prev) => ({
        ...prev,
        showAnswer: true,
      }));
    }
  }, [quizState.timeRemaining, quizState.showAnswer, quiz]);

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

  const handleSelectOption = (index: number) => {
    if (quizState.showAnswer) return; // 解答表示後は選択できない

    setQuizState((prev) => ({
      ...prev,
      selectedOptionIndex: index,
    }));
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect =
      quizState.selectedOptionIndex === currentQuestion.correctAnswerIndex;

    setQuizState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 100 : prev.score,
      showAnswer: true,
    }));
  };

  const handleNextQuestion = () => {
    const isLastQuestion =
      quizState.currentQuestionIndex === quizState.questions.length - 1;

    if (isLastQuestion) {
      finishQuiz();
    } else {
      // 次の問題へ
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOptionIndex: null,
        showAnswer: false,
        timeRemaining: 20,
      }));
    }
  };

  const finishQuiz = async () => {
    // テスト終了処理
    const maxScore = quizState.questions.length * 100;
    const completedAt = new Date();

    if (user) {
      try {
        // APIを呼び出してテスト結果を保存
        const response = await fetch("/api/quizzes/results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: quiz.id,
            score: quizState.score,
            maxScore,
            completedAt,
          }),
        });

        if (!response.ok) {
          throw new Error("テスト結果の保存に失敗しました");
        }

        const data = await response.json();
        setQuizResult(data.quizResult);
        setNewBadge(data.newBadge);
      } catch (error) {
        console.error("テスト結果の保存中にエラーが発生しました:", error);
        // エラーが発生しても、ユーザーには結果を表示
        setQuizResult({
          id: `temp-${Date.now()}`,
          quizId: quiz.id,
          quizName: quiz.name,
          score: quizState.score,
          maxScore,
          completedAt,
        });
      }
    } else {
      // 未ログインユーザーの場合は結果だけ表示
      setQuizResult({
        id: `temp-${Date.now()}`,
        quizId: quiz.id,
        quizName: quiz.name,
        score: quizState.score,
        maxScore,
        completedAt,
      });
    }

    setQuizEnded(true);
  };

  const handleContinueAfterResult = async () => {
    if (user) {
      // セッションを更新してからリダイレクト
      await fetch("/api/auth/session?update=true");
      router.push("/dashboard");
    } else {
      router.push("/quizzes");
    }
  };

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
              timeRemaining={quizState.timeRemaining}
              progress={progress}
              showProgress={true}
            />

            <QuizCard
              question={currentQuestion}
              selectedOptionIndex={quizState.selectedOptionIndex}
              showAnswer={quizState.showAnswer}
              onSelectOption={handleSelectOption}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
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
