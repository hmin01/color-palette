"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ColorCard from "./ColorCard";
import { getColors } from "@/app/actions/colorActions";
import type { ColorDto } from "@/types/color";

const PAGE_SIZE = 12;

// shimmer 그라디언트 공통 스타일
const shimmerStyle = {
  background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
  backgroundSize: "200% 100%",
} as const;

// ─── 스켈레톤 카드 ────────────────────────────────────────────────────────────

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-sm animate-card-in"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {/* 스와치 영역 */}
      <div className="h-52 animate-shimmer" style={shimmerStyle} />

      {/* 정보 영역 */}
      <div className="p-5 space-y-3">
        <div
          className="h-5 rounded-full w-3/4 animate-shimmer"
          style={{ ...shimmerStyle, animationDelay: "80ms" }}
        />
        <div className="flex items-center justify-between mt-3">
          <div
            className="h-4 rounded-full w-24 animate-shimmer"
            style={{ ...shimmerStyle, animationDelay: "160ms" }}
          />
          <div
            className="h-6 rounded-full w-14 animate-shimmer"
            style={{ ...shimmerStyle, animationDelay: "200ms" }}
          />
        </div>
      </div>

      {/* 하단 액센트 바 */}
      <div className="h-1 animate-shimmer" style={shimmerStyle} />
    </div>
  );
}

// ─── 무한 스크롤 그리드 ───────────────────────────────────────────────────────

type Props = {
  category: string;
  search: string;
  year: number | null;
};

export default function InfiniteScrollGrid({ category, search, year }: Props) {
  const [colors, setColors] = useState<ColorDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 필터 변경 시 초기 로드
  useEffect(() => {
    let cancelled = false;
    // 이전 카드 초기화 → 스켈레톤 그리드 표시
    setColors([]);
    setIsLoading(true);
    getColors({ category, search, year, page: 1, pageSize: PAGE_SIZE }).then(
      (res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setColors(res.data);
          setTotalPages(res.meta?.totalPages ?? 1);
          setPage(1);
        }
        setIsLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [category, search, year]);

  const loadMore = useCallback(() => {
    if (isLoading || page >= totalPages) return;
    const nextPage = page + 1;
    setIsLoading(true);
    getColors({
      category,
      search,
      year,
      page: nextPage,
      pageSize: PAGE_SIZE,
    }).then((res) => {
      if (res.success && res.data) {
        setColors((prev) => [...prev, ...res.data!]);
        setPage(nextPage);
      }
      setIsLoading(false);
    });
  }, [isLoading, page, totalPages, category, search, year]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: "0px 0px 300px 0px" }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // 초기 로딩: 스켈레톤 그리드 전체 표시
  if (isLoading && colors.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  // 결과 없음
  if (!isLoading && colors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>
        <p className="font-semibold">해당 조건에 맞는 컬러가 없습니다</p>
      </div>
    );
  }

  const hasMore = page < totalPages;

  return (
    <div>
      {/* 카드 그리드 — 각 카드 스태거 애니메이션 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {colors.map((color, index) => (
          <div
            key={color.id}
            className="animate-card-in"
            style={{ animationDelay: `${(index % PAGE_SIZE) * 55}ms` }}
          >
            <ColorCard color={color} />
          </div>
        ))}
      </div>

      {/* IntersectionObserver 감지용 센티넬 */}
      <div ref={sentinelRef} className="h-4" />

      {/* 무한 스크롤 추가 로딩: 하단 스켈레톤 */}
      {isLoading && colors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      )}

      {/* 완료 메시지 */}
      {!hasMore && colors.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
          <div className="flex gap-2 mb-2">
            {["#BB2649", "#F5DF4D", "#0F4C81", "#88B04B"].map((hex) => (
              <div
                key={hex}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold">모든 팬톤 컬러를 불러왔습니다</p>
          <p className="text-xs">총 {colors.length}개의 컬러</p>
        </div>
      )}
    </div>
  );
}
