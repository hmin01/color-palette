"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TimelineItem from "./TimelineItem";
import ColorModal from "@/components/ColorModal";
import type { ColorDto } from "@/types/color";

type TimelineClientProps = {
  colors: ColorDto[];
};

export default function TimelineClient({ colors }: TimelineClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver: 뷰포트 중앙에 있는 아이템을 활성 상태로 설정
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        // 뷰포트 상하 40% 를 제외한 중앙 20% 영역에서만 감지
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [colors]);

  const bgHex = colors[activeIndex]?.hex ?? "#1a1a2e";

  if (colors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white/50 text-lg">컬러 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgHex }}
    >
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/20 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          팔레트
        </Link>
        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
          Colors of the Year
        </span>
      </div>

      {/* 타임라인 본문 */}
      <div className="max-w-xl mx-auto px-6 py-16">
        {/* 페이지 제목 */}
        <div className="mb-14">
          <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-3">
            Pantone Color of the Year
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Colors
            <br />
            of the Year
          </h1>
          <p className="mt-3 text-white/40 text-sm font-medium">
            {colors[0]?.year} — {colors[colors.length - 1]?.year}
          </p>
        </div>

        {/* 타임라인 아이템 목록 */}
        <div className="relative">
          {/* 수직 연결선 — gap-6(24px) + year-w-16(64px) + dot-center(5px) = 93px */}
          <div className="absolute left-[93px] top-0 bottom-0 w-px bg-white/15 pointer-events-none" />

          {colors.map((color, index) => (
            <TimelineItem
              key={color.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              color={color}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>

      {/* 색상 모달 (전역) */}
      <ColorModal />
    </div>
  );
}
