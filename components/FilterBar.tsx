"use client";

import { CATEGORIES, type Category } from "@/data/pantone-colors";

const CATEGORY_COLORS: Record<Category, string> = {
  All: "#6366f1",
  Warm: "#FB923C",
  Red: "#EF4444",
  Orange: "#F97316",
  Yellow: "#EAB308",
  Green: "#22C55E",
  Blue: "#3B82F6",
  Purple: "#A855F7",
  Pink: "#EC4899",
  Neutral: "#94A3B8",
};

type Props = {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  counts: Record<string, number>;
};

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  counts,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const color = CATEGORY_COLORS[cat];
          const count = cat === "All" ? counts["All"] : counts[cat] ?? 0;

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={[
                "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0",
                isActive
                  ? "text-white shadow-md scale-105"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
              ].join(" ")}
              style={
                isActive
                  ? { backgroundColor: color, boxShadow: `0 4px 14px ${color}55` }
                  : {}
              }
            >
              {/* 카테고리 색상 점 (비활성 상태에서만 표시) */}
              {!isActive && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
              )}
              {cat}
              <span
                className={[
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
