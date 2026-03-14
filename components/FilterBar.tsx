"use client";

import { CATEGORIES, type Category } from "@/types/color";

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
  search: string;
  onSearchChange: (value: string) => void;
  year: number | null;
  onYearChange: (year: number | null) => void;
  years: number[];
  onImageMatcherOpen: () => void;
};

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  onImageMatcherOpen,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3 space-y-3">
      {/* 검색 입력 + 연도 드롭다운 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="색상 이름, 코드, HEX 검색..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
              aria-label="검색어 초기화"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 이미지 색상 매처 버튼 */}
        <button
          type="button"
          onClick={onImageMatcherOpen}
          title="이미지에서 팬톤 컬러 찾기"
          className="shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="이미지 색상 매처 열기"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>

        {/* 연도 필터 */}
        <div className="relative shrink-0">
          <select
            value={year ?? ""}
            onChange={(e) =>
              onYearChange(e.target.value ? Number(e.target.value) : null)
            }
            className={[
              "appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer",
              year !== null
                ? "bg-indigo-500 text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100",
            ].join(" ")}
          >
            <option value="">연도 전체</option>
            {[...years].reverse().map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={[
              "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none",
              year !== null ? "text-white" : "text-gray-400",
            ].join(" ")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gray-100" />

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const color = CATEGORY_COLORS[cat];

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={[
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0",
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
              {!isActive && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
