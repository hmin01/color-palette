"use client";

import { useState, useMemo } from "react";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import { type Category } from "@/types/color";
import type { PantoneColor } from "@/types/color";

type Props = {
  colors: PantoneColor[];
};

export default function ColorPalette({ colors }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number | null>(null);

  /** COTYE로 지정된 연도 목록 (오름차순) */
  const years = useMemo(
    () =>
      Array.from(
        new Set(colors.filter((c) => c.year !== undefined).map((c) => c.year!))
      ).sort((a, b) => a - b),
    [colors]
  );

  const filteredColors = useMemo(() => {
    let result =
      activeCategory === "All"
        ? colors
        : colors.filter((c) => c.category === activeCategory);

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
  }, [colors, activeCategory, search, year]);

  /** 각 카테고리별 컬러 수 (검색·연도 필터와 무관한 전체 기준) */
  const counts = useMemo(() => {
    const result: Record<string, number> = { All: colors.length };
    for (const color of colors) {
      result[color.category] = (result[color.category] ?? 0) + 1;
    }
    return result;
  }, [colors]);

  return (
    <>
      {/* 전역 컬러 모달 — 페이지 내 단일 인스턴스 */}
      <ColorModal />

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
          years={years}
        />
      </div>

      {/* 컬러 카드 그리드 (인피니티 스크롤) */}
      {/* key를 변경해 필터 조합이 바뀔 때 그리드를 리셋 */}
      <InfiniteScrollGrid
        key={`${activeCategory}-${year ?? "all"}-${search}`}
        colors={filteredColors}
      />
    </>
  );
}
