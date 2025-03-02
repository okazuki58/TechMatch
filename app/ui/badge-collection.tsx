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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4 flex flex-col items-center h-full shadow-sm"
        >
          {/* バッジアイコン - 適切なサイズに調整 */}
          <div className="mb-3 relative">
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-full"></div>
            <Image
              src={badge.imageUrl}
              alt={badge.name}
              width={80}
              height={80}
              className="object-contain hover:scale-110 transition-transform rounded-full bg-white p-1 relative z-10 shadow-sm"
            />
          </div>

          {/* タイトル - 固定高さと行数制限 */}
          <h3 className="text-sm font-bold text-gray-800 text-center mb-1 line-clamp-2 h-10 flex items-center justify-center">
            {badge.name}
          </h3>

          {/* 獲得日 - より洗練されたデザイン */}
          <div className="mt-auto pt-2 w-full">
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block w-full text-center">
              {new Date(badge.achievedAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BadgeCollection;
