"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import { PANTONE_COLORS, type Category } from "@/data/pantone-colors";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredColors = useMemo(() => {
    if (activeCategory === "All") return PANTONE_COLORS;
    return PANTONE_COLORS.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  /** 각 카테고리별 컬러 수 */
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

        {/* 필터 바 (sticky) */}
        <div className="sticky top-4 z-20">
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* 컬러 카드 그리드 (인피니티 스크롤) */}
        {/* key를 activeCategory로 설정해 카테고리 변경 시 컴포넌트를 리셋 */}
        <InfiniteScrollGrid key={activeCategory} colors={filteredColors} />

        {/* 푸터 */}
        <footer className="py-10 text-center text-sm text-gray-400">
          copyright &copy; hmin
        </footer>
      </div>
    </main>
  );
}
