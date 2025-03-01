// app/ui/quiz-result.tsx
import React from "react";
import { QuizResult, Badge as BadgeType } from "@/app/lib/definitions";
import Badge from "./badge";

interface QuizResultsProps {
  result: QuizResult;
  badge: BadgeType | null;
  onContinue: () => void;
}

const QuizResultScreen: React.FC<QuizResultsProps> = ({
  result,
  badge,
  onContinue,
}) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);

  // スコアに基づいたメッセージとスタイル
  let message: string;
  let bgClass: string;
  let textClass: string;

  if (percentage >= 80) {
    message = "すばらしい！あなたは本当の知識人です！";
    bgClass = "bg-green-50";
    textClass = "text-green-700";
  } else if (percentage >= 60) {
    message = "よくできました！まだ伸びしろがありますね！";
    bgClass = "bg-blue-50";
    textClass = "text-blue-700";
  } else if (percentage >= 40) {
    message = "もう少し頑張りましょう！";
    bgClass = "bg-yellow-50";
    textClass = "text-yellow-700";
  } else {
    message = "今回は残念でした。次回に期待しましょう！";
    bgClass = "bg-red-50";
    textClass = "text-red-700";
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">テスト結果</h2>

      <div
        className={`${bgClass} ${textClass} p-4 rounded-lg text-center mb-6`}
      >
        <p className="text-xl font-medium">{message}</p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-36 h-36 mb-4">
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <div className="text-3xl font-bold">{percentage}%</div>
          </div>
          {/* 円形プログレスバーを表現 */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#eee"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={percentage >= 60 ? "#3949ab" : "#f59e0b"}
              strokeWidth="6"
              strokeDasharray={`${percentage * 2.83} 283`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        <div className="text-center mb-2">
          <p className="text-lg font-medium">
            スコア: <span className="font-bold">{result.score}</span> /{" "}
            {result.maxScore}
          </p>
          <p className="text-sm text-gray-500">
            完了日:{" "}
            {typeof result.completedAt === "string"
              ? new Date(result.completedAt).toLocaleDateString()
              : result.completedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {badge && (
        <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 mb-6">
          <h3 className="text-center text-lg font-medium text-blue-700 mb-3">
            新しいバッジを獲得しました！
          </h3>
          <div className="flex justify-center">
            <Badge badge={badge} size="lg" showDetails={true} />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={onContinue} className="btn btn-primary">
          続ける
        </button>
      </div>
    </div>
  );
};

export default QuizResultScreen;
