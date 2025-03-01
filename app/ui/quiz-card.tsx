import React from "react";
import { QuizQuestion } from "@/app/lib/definitions";

interface QuizCardProps {
  question: QuizQuestion;
  selectedOptionIndex: number | null;
  showAnswer: boolean;
  onSelectOption: (index: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOptionIndex,
  showAnswer,
  onSelectOption,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion,
}) => {
  const getOptionClassName = (index: number) => {
    let className =
      "quiz-option mb-3 text-lg p-3 border rounded-lg cursor-pointer";

    if (index === selectedOptionIndex) {
      className += " selected bg-blue-50 border-blue-500";
    } else {
      className += " hover:bg-gray-50";
    }

    return className;
  };

  // 選択肢を選んだ時に即座に回答提出
  const handleOptionSelect = (index: number) => {
    if (!showAnswer && selectedOptionIndex === null) {
      onSelectOption(index);
      onSubmitAnswer();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
        {question.category}
      </span>

      <div className="h-28 overflow-y-auto mb-6">
        <h2 className="text-xl md:text-2xl font-medium">{question.question}</h2>
      </div>

      {/* 選択肢 - 固定高さのコンテナに配置 */}
      <div className="mb-6 h-64 overflow-y-auto">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={getOptionClassName(index)}
            onClick={() => handleOptionSelect(index)}
          >
            {option}
          </div>
        ))}
      </div>

      {/* ボタン - 固定位置 */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={() =>
            alert("ヒント: この問題に関するヒントがここに表示されます。")
          }
        >
          ヒント
        </button>

        {showAnswer ? (
          <button className="btn btn-primary" onClick={onNextQuestion}>
            {isLastQuestion ? "結果を表示" : "次の問題"}
          </button>
        ) : (
          <button className="btn btn-disabled" disabled>
            回答を選択してください
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
