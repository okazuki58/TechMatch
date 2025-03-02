import React from "react";
import Image from "next/image";
import { Badge as BadgeType } from "@/app/lib/definitions";

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
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {badges.map((badge) => (
        <div key={badge.id} className="flex flex-col items-center h-full">
          {/* バッジアイコン - 大きく */}
          <div className="w-24 h-24 mb-3">
            <Image
              src={badge.imageUrl}
              alt={badge.name}
              width={96}
              height={96}
              className="object-contain hover:scale-105 transition-transform rounded-full bg-white"
            />
          </div>

          {/* タイトル - 固定高さと行数制限 */}
          <h3 className="text-md font-bold text-gray-800 text-center mb-2 flex items-center line-clamp-2">
            {badge.name}
          </h3>

          {/* 獲得日 */}
          <span className="text-xs text-gray-500 mt-auto">
            {new Date(badge.achievedAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BadgeCollection;
