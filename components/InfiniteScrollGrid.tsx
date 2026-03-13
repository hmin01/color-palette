"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ColorCard from "./ColorCard";
import type { PantoneColor } from "@/types/color";

const PAGE_SIZE = 12;

type Props = {
  colors: PantoneColor[];
};

export default function InfiniteScrollGrid({ colors }: Props) {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (isLoading || displayCount >= colors.length) return;
    setIsLoading(true);
    // 로딩 효과를 위한 약간의 지연
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, colors.length));
      setIsLoading(false);
    }, 500);
  }, [isLoading, displayCount, colors.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 300px 0px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // 카테고리 변경 시 초기화
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [colors]);

  const displayed = colors.slice(0, displayCount);
  const hasMore = displayCount < colors.length;

  if (colors.length === 0) {
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
        <p className="font-semibold">해당 카테고리에 컬러가 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayed.map((color) => (
          <ColorCard key={color.id} color={color} />
        ))}
      </div>

      {/* IntersectionObserver 감지용 센티넬 */}
      <div ref={sentinelRef} className="h-4" />

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="flex justify-center py-10 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gray-300 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* 스켈레톤 카드 (로딩 중 미리보기) */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-52 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded-full w-3/4" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
              </div>
              <div className="h-1 bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* 완료 메시지 */}
      {!hasMore && displayed.length > 0 && (
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
          <p className="text-xs">총 {displayed.length}개의 컬러</p>
        </div>
      )}
    </div>
  );
}
