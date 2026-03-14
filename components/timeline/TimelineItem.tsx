"use client";

import { forwardRef } from "react";
import { useColorModalStore } from "@/store/colorModalStore";
import { getTextColorForBg } from "@/utils/color";
import type { ColorDto } from "@/types/color";

type TimelineItemProps = {
  color: ColorDto;
  isActive: boolean;
};

// 연도별 타임라인 아이템 — IntersectionObserver를 위해 ref 전달 가능
const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ color, isActive }, ref) => {
    const open = useColorModalStore((s) => s.open);
    const textColor = getTextColorForBg(color.hex);

    return (
      <div
        ref={ref}
        className={`flex items-center gap-6 py-10 transition-all duration-500 ${
          isActive ? "opacity-100" : "opacity-35"
        }`}
      >
        {/* 연도 — 64px 고정 너비 */}
        <div className="w-16 shrink-0 text-right">
          <span
            className={`text-xl font-extrabold transition-all duration-300 ${
              isActive ? "text-white text-2xl" : "text-white/60"
            }`}
          >
            {color.year}
          </span>
        </div>

        {/* 타임라인 점 — 수직선 위에 위치 (gap-6=24px → center at 64+24+5=93px) */}
        <div
          className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
            isActive ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-125" : ""
          }`}
          style={{ backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.5)" }}
        />

        {/* 클릭 가능한 색상 카드 */}
        <button
          type="button"
          onClick={() => open(color)}
          className="group flex items-center gap-4 text-left hover:opacity-90 active:scale-98 transition-all duration-200"
        >
          {/* 대형 스와치 */}
          <div
            className={`rounded-2xl shadow-lg transition-all duration-300 ${
              isActive
                ? "w-20 h-20 md:w-24 md:h-24 shadow-2xl group-hover:scale-105"
                : "w-16 h-16 md:w-20 md:h-20 group-hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {/* 팬톤 레이블 */}
            <div className="flex flex-col justify-end h-full p-2.5">
              <span
                className="font-mono text-[7px] font-extrabold tracking-widest opacity-50"
                style={{ color: textColor }}
              >
                PANTONE
              </span>
            </div>
          </div>

          {/* 텍스트 정보 */}
          <div>
            <p className="font-mono text-[10px] font-bold text-white/50 tracking-widest uppercase mb-0.5">
              {color.code}
            </p>
            <p
              className={`font-extrabold text-white leading-tight transition-all duration-300 ${
                isActive ? "text-xl md:text-2xl" : "text-lg"
              }`}
            >
              {color.name}
            </p>
          </div>
        </button>
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

export default TimelineItem;
