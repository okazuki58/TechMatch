import React from "react";
import Image from "next/image";
import { Badge as BadgeType } from "@/app/lib/definitions";

interface BadgeProps {
  badge: BadgeType;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  badge,
  size = "md",
  showDetails = false,
}) => {
  // サイズに応じた寸法
  const dimensions = {
    sm: { width: 40, height: 40 },
    md: { width: 64, height: 64 },
    lg: { width: 96, height: 96 },
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
        relative rounded-full overflow-hidden
        ${size === "sm" ? "w-10 h-10" : ""}
        ${size === "md" ? "w-16 h-16" : ""}
        ${size === "lg" ? "w-24 h-24" : ""}
        border-2 border-blue-600 p-0.5
      `}
      >
        <Image
          src={badge.imageUrl || "/badges/knowledge-badge.svg"}
          alt={badge.name}
          width={dimensions[size].width}
          height={dimensions[size].height}
          className="rounded-full object-cover"
        />
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <h3 className="font-medium text-blue-700">{badge.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            獲得日:{" "}
            {badge.achievedAt &&
              (typeof badge.achievedAt === "string"
                ? new Date(badge.achievedAt).toLocaleDateString()
                : badge.achievedAt.toLocaleDateString())}
          </p>
        </div>
      )}
    </div>
  );
};

export default Badge;

// app/ui/badge-collection.tsx
