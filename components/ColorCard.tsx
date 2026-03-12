"use client";

import { useState } from "react";
import { type PantoneColor } from "@/data/pantone-colors";
import { getTextColorForBg, hexToRgb } from "@/utils/color";
import { useColorModalStore } from "@/store/colorModalStore";

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
  color: PantoneColor;
};

export default function ColorCard({ color }: Props) {
  // open 함수만 구독 — isOpen 변경 시 카드가 리렌더링되지 않음
  const open = useColorModalStore((s) => s.open);

  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";

  return (
    <article
      onClick={() => open(color)}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {/* 컬러 스와치 영역 */}
      <div
        className="h-52 flex flex-col justify-between p-5"
        style={{ backgroundColor: color.hex }}
      >
        <div>
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
          ) : null}
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
