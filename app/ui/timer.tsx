import React from "react";

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
  // 残り時間が少ないときに警告色にする
  const getTimerColor = () => {
    if (timeRemaining <= 5) return "text-red-500";
    if (timeRemaining <= 10) return "text-orange-500";
    return "text-gray-600";
  };

  return (
    <div className={`text-center text-xl mb-6 ${getTimerColor()}`}>
      残り時間: <span className="font-bold">{timeRemaining}</span>秒
    </div>
  );
};

export default Timer;
