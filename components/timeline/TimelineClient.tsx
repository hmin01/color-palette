"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import ColorModal from "@/components/ColorModal";
import { useColorModalStore } from "@/store/colorModalStore";
import { getTextColorForBg } from "@/utils/color";
import type { ColorDto } from "@/types/color";

// 항목 고정 높이 (transform 계산에 사용)
const ITEM_H = 108;

// ── 타임라인 클라이언트 ────────────────────────────────────────────────────────

type TimelineClientProps = {
  colors: ColorDto[];
};

export default function TimelineClient({ colors }: TimelineClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState(700);
  const open = useColorModalStore((s) => s.open);

  // 콘텐츠 영역 높이 측정 (ResizeObserver)
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContainerH(el.clientHeight);
    const ro = new ResizeObserver(() => setContainerH(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 애니메이션 잠금과 함께 인덱스 이동
  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      setActiveIndex((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= colors.length) return prev;
        return next;
      });
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, 550);
    },
    [colors.length]
  );

  // 키보드: ArrowDown → 오래된 컬러, ArrowUp → 최신 컬러
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  // 마우스 휠 하이재킹: 한 번에 한 연도씩 이동
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [navigate]);

  const activeColor = colors[activeIndex];
  const textColor = activeColor ? getTextColorForBg(activeColor.hex) : "#ffffff";
  const isLight = textColor === "#1a1a1a";

  if (colors.length === 0) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white/50 text-lg">컬러 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 활성 항목이 콘텐츠 영역 세로 중앙에 오도록 translateY 계산
  const centerOffset = containerH / 2 - ITEM_H / 2;
  const translateY = centerOffset - activeIndex * ITEM_H;

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: activeColor?.hex ?? "#1a1a2e",
        transition: "background-color 0.7s ease",
      }}
    >
      {/* 헤더 */}
      <header
        className="flex-none px-6 py-4 flex items-center justify-between z-20 border-b"
        style={{
          backgroundColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
          borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
          style={{ color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)" }}
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
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}
        >
          Colors of the Year
        </span>
        <span
          className="font-mono text-xs font-bold"
          style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}
        >
          {activeIndex + 1} / {colors.length}
        </span>
      </header>

      {/* 타임라인 본체 */}
      <div ref={contentRef} className="flex-1 relative overflow-hidden">
        {/* 활성 행 하이라이트 밴드 */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{
            top: centerOffset,
            height: ITEM_H,
            background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.07)",
          }}
        />

        {/* 수직 연결선 — padding(32) + year(64) + gap(24) + dot중심(5) = 125px */}
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none z-0"
          style={{
            left: 125,
            backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
          }}
        />

        {/* 슬라이딩 목록 */}
        <div
          className="absolute left-0 right-0"
          style={{
            transform: `translateY(${translateY}px)`,
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {colors.map((color, index) => {
            const isActive = index === activeIndex;
            const distance = Math.abs(index - activeIndex);
            const opacity = Math.max(0.15, 1 - distance * 0.22);

            return (
              <div
                key={color.id}
                className="flex items-center gap-6 px-8 cursor-pointer"
                style={{
                  height: ITEM_H,
                  opacity,
                  transition: "opacity 0.4s ease",
                }}
                onClick={() => (isActive ? open(color) : setActiveIndex(index))}
              >
                {/* 연도 */}
                <div className="w-16 text-right shrink-0">
                  <span
                    className="font-extrabold transition-all duration-300"
                    style={{
                      color: textColor,
                      fontSize: isActive ? "1.375rem" : "1rem",
                    }}
                  >
                    {color.year}
                  </span>
                </div>

                {/* 타임라인 점 — gap-6(24px) 뒤에 위치 */}
                <div
                  className="shrink-0 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    backgroundColor: isActive ? textColor : (isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)"),
                    boxShadow: isActive
                      ? `0 0 0 4px ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`
                      : undefined,
                  }}
                />

                {/* 컬러 스와치 + 정보 */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="rounded-2xl shadow-md shrink-0 transition-all duration-300"
                    style={{
                      width: isActive ? 68 : 44,
                      height: isActive ? 68 : 44,
                      backgroundColor: color.hex,
                    }}
                  />
                  <div className="min-w-0">
                    <p
                      className="font-mono text-[9px] font-bold tracking-widest uppercase mb-0.5"
                      style={{ color: textColor, opacity: 0.45 }}
                    >
                      {color.code}
                    </p>
                    <p
                      className="font-extrabold leading-tight truncate transition-all duration-300"
                      style={{
                        color: textColor,
                        fontSize: isActive ? "1.15rem" : "0.9rem",
                      }}
                    >
                      {color.name}
                    </p>
                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          open(color);
                        }}
                        className="mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: isLight
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.18)",
                          color: textColor,
                        }}
                      >
                        자세히 보기 →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 컬러 모달 */}
      <ColorModal />
    </div>
  );
}
