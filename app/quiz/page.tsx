"use client";
import { useState, useEffect } from "react";

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: Question[]) => setQuestions(data));
  }, []);

  useEffect(() => {
    if (time > 0 && !isAnswered) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time, isAnswered]);

  if (questions.length === 0) return <p>ロード中...</p>;

  const currentQuestion = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.answer) {
      setScore(score + 100);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTime(20);
    }
  };

  return (
    <div className="app-container max-w-2xl mx-auto p-5">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">クイズマスター</h1>
        <div className="score-display text-lg">スコア: {score} 点</div>
      </header>

      <div className="progress-container bg-gray-300 h-2 rounded-full mb-4">
        <div
          className="progress-bar bg-blue-700 h-2 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="timer text-center text-gray-700 mb-4">
        残り時間: {time} 秒
      </div>

      <div className="quiz-card bg-white p-6 rounded-lg shadow-md">
        <span className="category-label bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
          {currentQuestion.category}
        </span>
        <h3 className="question text-lg font-semibold mt-2">
          {currentQuestion.question}
        </h3>

        <div className="options flex flex-col gap-3 mt-4">
          {currentQuestion.options.map((opt, index) => (
            <button
              key={index}
              className={`option border-2 p-3 rounded-lg text-left transition-all ${
                selectedOption === index
                  ? index === currentQuestion.answer
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-red-500 text-white border-red-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(index)}
            >
              {opt}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div
            className={`feedback-message mt-4 p-3 rounded-lg text-center ${
              selectedOption === currentQuestion.answer
                ? "feedback-correct bg-green-100 text-green-700"
                : "feedback-incorrect bg-red-100 text-red-700"
            }`}
          >
            {selectedOption === currentQuestion.answer
              ? "正解！"
              : `不正解！正解は ${
                  currentQuestion.options[currentQuestion.answer]
                } です。`}
          </div>
        )}

        <div className="controls flex justify-between mt-6">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-4 py-2 rounded ${
              isAnswered
                ? "bg-blue-700 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            次の問題
          </button>
        </div>
      </div>
    </div>
  );
}
