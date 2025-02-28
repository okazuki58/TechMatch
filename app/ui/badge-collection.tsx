import React from "react";
import { Badge as BadgeType } from "@/app/lib/definitions";
import Badge from "./badge";

interface BadgeCollectionProps {
  badges: BadgeType[];
  emptyMessage?: string;
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  emptyMessage = "まだバッジを獲得していません。テストに挑戦してバッジを集めましょう！",
}) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {badges.map((badge) => (
        <div key={badge.id} className="flex justify-center">
          <Badge badge={badge} showDetails={true} />
        </div>
      ))}
    </div>
  );
};

export default BadgeCollection;
