"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import PaletteTray from "@/components/PaletteTray";
import { getColorsOfTheYear, getColorById } from "@/app/actions/colorActions";
import { usePaletteStore } from "@/store/paletteStore";
import type { Category } from "@/types/color";

// ─── 팔레트 URL 동기화 (Suspense 필요) ───────────────────────────────────────

function PaletteUrlSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { colors, add } = usePaletteStore();

  // URL ?palette=id1,id2,...에서 초기 팔레트 복원
  useEffect(() => {
    const param = searchParams.get("palette");
    if (!param || colors.length > 0) return;

    const ids = param.split(",").filter(Boolean);
    ids.forEach((id) => {
      getColorById(id).then((res) => {
        if (res.success && res.data) add(res.data);
      });
    });
    // 초기 로드 시 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 팔레트 변경 시 URL 업데이트
  useEffect(() => {
    const ids = colors.map((c) => c.id).join(",");
    const newUrl = ids ? `/?palette=${ids}` : "/";
    router.replace(newUrl, { scroll: false });
  }, [colors, router]);

  return null;
}

// ─── 홈 페이지 ────────────────────────────────────────────────────────────────

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

  // 검색어 디바운스 (200ms) — API 호출 횟수 최소화
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <main className="min-h-screen">
      {/* 팔레트 URL 동기화 — useSearchParams는 Suspense 경계 필요 */}
      <Suspense fallback={null}>
        <PaletteUrlSync />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
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

      {/* 전역 컴포넌트 */}
      <ColorModal />
      <PaletteTray />
    </main>
  );
}
