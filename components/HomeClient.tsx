"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import InfiniteScrollGrid from "@/components/InfiniteScrollGrid";
import ColorModal from "@/components/ColorModal";
import PaletteTray from "@/components/PaletteTray";
import ImageMatcher from "@/components/ImageMatcher";
import { getColorById } from "@/app/actions/colorActions";
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

// ─── 홈 클라이언트 (필터·그리드 인터랙션) ─────────────────────────────────────

type HomeClientProps = {
  cotye_years: number[];
};

export default function HomeClient({ cotye_years }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [imageMatcherOpen, setImageMatcherOpen] = useState(false);

  // 검색어 디바운스 (200ms) — API 호출 횟수 최소화
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <>
      {/* 팔레트 URL 동기화 — useSearchParams는 Suspense 경계 필요 */}
      <Suspense fallback={null}>
        <PaletteUrlSync />
      </Suspense>

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
          onImageMatcherOpen={() => setImageMatcherOpen(true)}
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

      {/* 전역 컴포넌트 */}
      <ColorModal />
      <PaletteTray />
      {imageMatcherOpen && (
        <ImageMatcher onClose={() => setImageMatcherOpen(false)} />
      )}
    </>
  );
}
