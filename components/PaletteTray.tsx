"use client";

import { useEffect, useRef, useState } from "react";
import { usePaletteStore } from "@/store/paletteStore";
import type { ColorDto } from "@/types/color";

// ─── 내보내기 포맷 생성 함수 ──────────────────────────────────────────────────

function toCssVars(colors: ColorDto[]): string {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex.toUpperCase()}; /* ${c.name} */`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

function toTailwindConfig(colors: ColorDto[]): string {
  const obj = Object.fromEntries(
    colors.map((c, i) => [`color-${i + 1}`, c.hex.toUpperCase()])
  );
  return JSON.stringify(obj, null, 2);
}

function toJson(colors: ColorDto[]): string {
  return JSON.stringify(
    colors.map(({ name, hex, code }) => ({ name, hex: hex.toUpperCase(), code })),
    null,
    2
  );
}

// ─── 하단 팔레트 트레이 ──────────────────────────────────────────────────────

export default function PaletteTray() {
  const { colors, remove, clear } = usePaletteStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (!exportOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [exportOpen]);

  const handleExport = (format: "css" | "tailwind" | "json") => {
    let text = "";
    if (format === "css") text = toCssVars(colors);
    else if (format === "tailwind") text = toTailwindConfig(colors);
    else text = toJson(colors);

    navigator.clipboard.writeText(text);
    setCopied(format);
    setExportOpen(false);
    setTimeout(() => setCopied(null), 2000);
  };

  // 색상이 없으면 트레이 숨김
  if (colors.length === 0) return null;

  return (
    // 하단 고정 트레이 — 슬라이드업 애니메이션
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4 pointer-events-none">
      <div className="pointer-events-auto bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-slide-up border border-white/10 max-w-2xl w-full">

        {/* 색상 원형 목록 — padding으로 hover scale 클리핑 방지 */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto px-1 py-1">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => remove(color.id)}
              title={`${color.name} — 클릭하여 제거`}
              className="group relative w-9 h-9 rounded-full shrink-0 ring-2 ring-white/20 hover:ring-white/60 transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: color.hex }}
            >
              {/* hover 시 × 표시 */}
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                ×
              </span>
            </button>
          ))}
          <span className="text-white/30 text-xs font-bold shrink-0 ml-1">
            {colors.length}개 선택
          </span>
        </div>

        {/* 복사 완료 피드백 */}
        {copied && (
          <span className="text-emerald-400 text-xs font-bold shrink-0 animate-fade-in">
            ✓ {copied === "css" ? "CSS 변수" : copied === "tailwind" ? "Tailwind" : "JSON"} 복사됨
          </span>
        )}

        {/* 전체 선택 해제 */}
        <button
          type="button"
          onClick={clear}
          className="text-white/40 hover:text-white/80 text-xs font-bold transition-colors shrink-0"
        >
          전체 해제
        </button>

        {/* 내보내기 드롭다운 */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-white text-gray-900 text-xs font-extrabold px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            내보내기
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {exportOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-36">
              {(
                [
                  { id: "css", label: "CSS 변수" },
                  { id: "tailwind", label: "Tailwind" },
                  { id: "json", label: "JSON" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleExport(opt.id)}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-150 border-b border-gray-100 last:border-0"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
