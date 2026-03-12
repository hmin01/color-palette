"use client";

import { type PantoneColor } from "@/data/pantone-colors";
import { getTextColorForBg, hexToRgb } from "@/utils/color";

type Props = {
  color: PantoneColor;
  index: number;
};

export default function ColorCard({ color, index }: Props) {
  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";

  return (
    <article
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-slide-up opacity-0"
      style={{
        animationDelay: `${(index % 12) * 50}ms`,
        animationFillMode: "forwards",
      }}
    >
      {/* 컬러 스와치 영역 */}
      <div
        className="h-52 flex flex-col justify-between p-5"
        style={{ backgroundColor: color.hex }}
      >
        {/* 상단: COTYE 배지 */}
        <div className="flex items-start justify-between">
          {color.year ? (
            <span
              className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
                color: textColor,
              }}
            >
              COTYE · {color.year}
            </span>
          ) : (
            <div />
          )}

          {/* 복사 힌트 아이콘 (hover 시 표시) */}
          <div
            className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"
            style={{
              backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </div>
        </div>

        {/* 하단: 팬톤 코드 */}
        <div>
          <p
            className="font-mono text-xs font-bold tracking-wider opacity-60"
            style={{ color: textColor }}
          >
            PANTONE
          </p>
          <p
            className="font-mono text-lg font-extrabold leading-tight"
            style={{ color: textColor }}
          >
            {color.code}
          </p>
        </div>
      </div>

      {/* 컬러 정보 영역 */}
      <div className="p-5">
        <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
          {color.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {/* 작은 컬러 닷 */}
            <div
              className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs font-mono text-gray-400 uppercase">
              {color.hex}
            </span>
          </div>

          {/* 카테고리 배지 */}
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `rgba(${hexToRgb(color.hex)}, 0.12)`,
              color: color.hex,
            }}
          >
            {color.category}
          </span>
        </div>
      </div>

      {/* 하단 컬러 액센트 바 */}
      <div
        className="h-1 w-full transition-all duration-500 group-hover:h-1.5"
        style={{ backgroundColor: color.hex }}
      />
    </article>
  );
}
