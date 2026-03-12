"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import { PANTONE_COLORS, type Category } from "@/data/pantone-colors";

/** COTYE로 지정된 연도 목록 (오름차순) */
const COTYE_YEARS = Array.from(
  new Set(PANTONE_COLORS.filter((c) => c.year !== undefined).map((c) => c.year!))
).sort((a, b) => a - b);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number | null>(null);

  const filteredColors = useMemo(() => {
    let result =
      activeCategory === "All"
        ? PANTONE_COLORS
        : PANTONE_COLORS.filter((c) => c.category === activeCategory);

    if (year !== null) {
      result = result.filter((c) => c.year === year);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.hex.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, search, year]);

  /** 각 카테고리별 컬러 수 (검색·연도 필터와 무관한 전체 기준) */
  const counts = useMemo(() => {
    const result: Record<string, number> = { All: PANTONE_COLORS.length };
    for (const color of PANTONE_COLORS) {
      result[color.category] = (result[color.category] ?? 0) + 1;
    }
    return result;
  }, []);

  return (
    <main className="min-h-screen">
      {/* 전역 컬러 모달 — 페이지 내 단일 인스턴스 */}
      <ColorModal />
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* 헤더 */}
        <Header />

        {/* 통합 필터 바 (sticky) */}
        <div className="sticky top-4 z-20">
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={counts}
            search={search}
            onSearchChange={setSearch}
            year={year}
            onYearChange={setYear}
            years={COTYE_YEARS}
          />
        </div>

        {/* 컬러 카드 그리드 (인피니티 스크롤) */}
        {/* key를 변경해 필터 조합이 바뀔 때 그리드를 리셋 */}
        <InfiniteScrollGrid
          key={`${activeCategory}-${year ?? "all"}-${search}`}
          colors={filteredColors}
        />

        {/* 푸터 */}
        <footer className="py-10 text-center text-sm text-gray-400">
          copyright &copy; hmin
        </footer>
      </div>
    </main>
  );
}
