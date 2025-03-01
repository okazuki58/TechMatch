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
    let className = "quiz-option mb-3 text-lg";

    if (showAnswer) {
      if (index === question.correctAnswerIndex) {
        className += " correct";
      } else if (index === selectedOptionIndex) {
        className += " incorrect";
      }
    } else if (index === selectedOptionIndex) {
      className += " selected";
    }

    return className;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
        {question.category}
      </span>

      <div className="h-28 overflow-y-auto mb-6">
        <h2 className="text-xl md:text-2xl font-medium">{question.question}</h2>
      </div>

      <div className="mb-6">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={getOptionClassName(index)}
            onClick={() => !showAnswer && onSelectOption(index)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="h-16 mb-6">
        {showAnswer && (
          <div
            className={`p-4 rounded-lg text-center font-medium ${
              selectedOptionIndex === question.correctAnswerIndex
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {selectedOptionIndex === question.correctAnswerIndex
              ? "正解！よくできました！"
              : `不正解！正解は「${
                  question.options[question.correctAnswerIndex]
                }」です。`}
          </div>
        )}
      </div>

      <div className="flex justify-between">
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
          <button
            className={
              selectedOptionIndex !== null
                ? "btn btn-primary"
                : "btn btn-disabled"
            }
            onClick={onSubmitAnswer}
            disabled={selectedOptionIndex === null}
          >
            回答する
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
