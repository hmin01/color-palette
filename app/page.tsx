"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import { getColorsOfTheYear } from "@/app/actions/colorActions";
import type { Category } from "@/types/color";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [cotye_years, setCotye_years] = useState<number[]>([]);

  // COTYE 연도 목록 초기 로드
  useEffect(() => {
    getColorsOfTheYear().then((res) => {
      if (res.success && res.data) {
        const years = Array.from(
          new Set(res.data.map((c) => c.year).filter((y): y is number => y !== null))
        ).sort((a, b) => a - b);
        setCotye_years(years);
      }
    });
  }, []);

  // 검색어 디바운스 (100ms) — API 호출 횟수 최소화
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 100);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
            search={searchInput}
            onSearchChange={setSearchInput}
            year={year}
            onYearChange={setYear}
            years={cotye_years}
          />
        </div>

        {/* 컬러 카드 그리드 (인피니티 스크롤) */}
        {/* key를 변경해 필터 조합이 바뀔 때 그리드를 리셋 */}
        <InfiniteScrollGrid
          key={`${activeCategory}-${year ?? "all"}-${debouncedSearch}`}
          category={activeCategory}
          search={debouncedSearch}
          year={year}
        />

        {/* 푸터 */}
        <footer className="py-10 text-center text-sm text-gray-400">
          copyright &copy; hmin
        </footer>
      </div>
    </main>
  );
}
