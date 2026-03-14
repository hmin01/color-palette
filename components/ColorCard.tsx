"use client";

import { useState } from "react";
import type { ColorDto } from "@/types/color";
import { getTextColorForBg, hexToRgb } from "@/utils/color";
import { useColorModalStore } from "@/store/colorModalStore";
import { usePaletteStore } from "@/store/paletteStore";

// ─── Hex 복사 버튼 ────────────────────────────────────────────────────────────

function HexCopyButton({ hex, accentColor }: { hex: string; accentColor: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // 카드 클릭(모달 열기)으로 이벤트가 전파되지 않도록 차단
    e.stopPropagation();
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-1.5"
      title="클릭하여 복사"
    >
      <div
        className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm shrink-0"
        style={{ backgroundColor: accentColor }}
      />
      <span
        className="text-xs font-mono uppercase transition-colors duration-200"
        style={copied ? { color: accentColor } : { color: "#9ca3af" }}
      >
        {copied ? "복사됨!" : hex}
      </span>
    </button>
  );
}

// ─── 카드 ─────────────────────────────────────────────────────────────────────

type Props = {
  color: ColorDto;
};

export default function ColorCard({ color }: Props) {
  // open 함수만 구독 — isOpen 변경 시 카드가 리렌더링되지 않음
  const open = useColorModalStore((s) => s.open);
  const { add, remove, has } = usePaletteStore();
  const inPalette = has(color.id);

  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";

  const handlePaletteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inPalette) {
      remove(color.id);
    } else {
      add(color);
    }
  };

  return (
    <article
      onClick={() => open(color)}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* 컬러 스와치 영역 */}
      <div
        className="h-52 flex flex-col justify-between p-5 relative"
        style={{ backgroundColor: color.hex }}
      >
        <div className="flex items-start justify-between">
          {color.year ? (
            <span
              className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
                color: textColor,
              }}
            >
              COTYE · {color.year}
            </span>
          ) : <div />}

          {/* 팔레트 추가/제거 버튼 — hover 시 노출 */}
          <button
            type="button"
            onClick={handlePaletteToggle}
            title={inPalette ? "팔레트에서 제거" : "팔레트에 추가"}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              inPalette
                ? "opacity-100 scale-100"
                : "opacity-50 hover:opacity-100 scale-100"
            }`}
            style={{
              backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
              color: textColor,
            }}
          >
            {inPalette ? (
              // 체크 아이콘
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              // 플러스 아이콘
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
          </button>
        </div>

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
          <HexCopyButton hex={color.hex} accentColor={color.hex} />

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
      <div className="h-1 w-full" style={{ backgroundColor: color.hex }} />
    </article>
  );
}
