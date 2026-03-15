"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useColorModalStore } from "@/store/colorModalStore";
import {
  getTextColorForBg,
  hexToRgb,
  hexToRgbObject,
  hexToHsl,
  hexToHsb,
  generateShades,
  generateTints,
  generateSaturations,
  getContrastRatio,
  getWcagGrade,
} from "@/utils/color";

type Tab = "values" | "scale";

// ─── 색상 값 행 ───────────────────────────────────────────────────────────────

type ColorValueRowProps = {
  label: string;
  display: string;
  copyText: string;
  accentHex: string;
};

function ColorValueRow({ label, display, copyText, accentHex }: ColorValueRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
      <span className="text-[10px] font-extrabold tracking-wider text-gray-400 w-8 shrink-0 uppercase">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-gray-800 flex-1">
        {display}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 h-7 px-2.5 rounded-lg text-xs font-bold transition-all duration-200"
        style={
          copied
            ? { backgroundColor: `rgba(${hexToRgb(accentHex)}, 0.12)`, color: accentHex }
            : {}
        }
      >
        {copied ? "복사됨" : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-gray-500 transition-colors">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── 스케일 스와치 셀 ────────────────────────────────────────────────────────

function SwatchCell({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={hex.toUpperCase()}
      className="flex-1 group flex flex-col items-center gap-1"
    >
      <div
        className="w-full h-10 rounded-lg transition-transform duration-150 group-hover:scale-105 group-hover:-translate-y-0.5"
        style={{ backgroundColor: hex }}
      />
      <span className="text-[7px] font-bold text-gray-300 group-hover:text-gray-500 transition-colors">
        {copied ? "✓" : ""}
      </span>
    </button>
  );
}

// ─── 스케일 행 (라벨 + 전체 복사 + 스와치) ───────────────────────────────────

type ScaleRowProps = {
  label: string;
  hexes: string[];
};

function ScaleRow({ label, hexes }: ScaleRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const arr = hexes.map((h) => h.toUpperCase());
    navigator.clipboard.writeText(JSON.stringify(arr, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          {copied ? "✓ 복사됨" : "전체 복사"}
        </button>
      </div>
      <div className="flex gap-1">
        {hexes.map((hex, i) => (
          <SwatchCell key={i} hex={hex} />
        ))}
      </div>
    </div>
  );
}

// ─── WCAG 대비율 행 ──────────────────────────────────────────────────────────

type ContrastRowProps = {
  bg: "white" | "black";
  ratio: number;
  grade: "AAA" | "AA" | "fail";
};

function ContrastRow({ bg, ratio, grade }: ContrastRowProps) {
  const gradeColor = { AAA: "#10b981", AA: "#3b82f6", fail: "#9ca3af" }[grade];
  const gradeLabel = grade === "fail" ? "FAIL" : grade;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
      {/* 배경 컬러 미리보기 */}
      <div
        className="w-6 h-6 rounded-lg ring-1 ring-gray-200 shrink-0"
        style={{ backgroundColor: bg === "white" ? "#ffffff" : "#1a1a1a" }}
      />
      <span className="text-xs text-gray-500 flex-1 font-medium">
        {bg === "white" ? "흰색 배경" : "검은 배경"}
      </span>
      {/* 대비율 */}
      <span className="font-mono text-sm font-extrabold text-gray-700">
        {ratio.toFixed(1)}:1
      </span>
      {/* 등급 뱃지 */}
      <span
        className="text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${gradeColor}18`, color: gradeColor }}
      >
        {gradeLabel}
      </span>
    </div>
  );
}

// ─── 전역 컬러 모달 ───────────────────────────────────────────────────────────

export default function ColorModal() {
  const isOpen = useColorModalStore((s) => s.isOpen);
  const selectedColor = useColorModalStore((s) => s.selectedColor);
  const close = useColorModalStore((s) => s.close);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("values");
  const prevColorId = useRef<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // 색상이 바뀌면 스케일 탭으로 초기화
  useEffect(() => {
    if (selectedColor && selectedColor.id !== prevColorId.current) {
      setActiveTab("values");
      prevColorId.current = selectedColor.id;
    }
  }, [selectedColor]);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted || !isOpen || !selectedColor) return null;

  const color = selectedColor;
  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";
  const rgb = hexToRgbObject(color.hex);
  const hsl = hexToHsl(color.hex);
  const hsb = hexToHsb(color.hex);
  const shades = generateShades(color.hex, 10);
  const tints = generateTints(color.hex, 10);
  const saturations = generateSaturations(color.hex, 10);
  const contrastWhite = getContrastRatio(color.hex, "#ffffff");
  const contrastBlack = getContrastRatio(color.hex, "#000000");
  const gradeWhite = getWcagGrade(contrastWhite);
  const gradeBlack = getWcagGrade(contrastBlack);

  const colorValues = [
    { label: "HEX", display: color.hex.toUpperCase(), copyText: color.hex.toUpperCase() },
    { label: "RGB", display: `${rgb.r}, ${rgb.g}, ${rgb.b}`, copyText: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSB", display: `${hsb.h}°, ${hsb.s}%, ${hsb.b}%`, copyText: `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)` },
    { label: "HSL", display: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, copyText: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  const TABS: { id: Tab; label: string }[] = [
    { id: "values", label: "색상값" },
    { id: "scale", label: "스케일" },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />

      {/* 패널 래퍼 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl animate-slide-up overflow-hidden">

          {/* ── 헤더: 컬러 스와치 ── */}
          <div className="h-40 relative" style={{ backgroundColor: color.hex }}>
            {/* 상단: COTYE 배지 + 닫기 */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
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

              <button
                type="button"
                onClick={close}
                aria-label="모달 닫기"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
                  color: textColor,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 하단: 팬톤 코드 */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-mono text-[10px] font-bold tracking-widest opacity-50" style={{ color: textColor }}>
                PANTONE
              </p>
              <p className="font-mono text-2xl font-extrabold leading-tight" style={{ color: textColor }}>
                {color.code}
              </p>
            </div>
          </div>

          {/* ── 색상명 + 카테고리 ── */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight truncate">
              {color.name}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `rgba(${hexToRgb(color.hex)}, 0.12)`,
                  color: color.hex,
                }}
              >
                {color.category}
              </span>
              {color.year && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                  {color.year}
                </span>
              )}
            </div>
          </div>

          {/* ── Segmented Control 탭 바 ── */}
          <div className="px-5 pb-4">
            <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── 탭 콘텐츠 (최소 높이 고정 → 탭 전환 시 모달 크기 유지) ── */}
          <div className="px-5 pb-5 min-h-[220px]">

            {/* 색상값 탭 */}
            <div className={activeTab !== "values" ? "hidden" : ""}>
              {/* WCAG 대비율 */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden mb-3">
                <ContrastRow bg="white" ratio={contrastWhite} grade={gradeWhite} />
                <ContrastRow bg="black" ratio={contrastBlack} grade={gradeBlack} />
              </div>
              {/* 색상값 */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                {colorValues.map((cv) => (
                  <ColorValueRow
                    key={cv.label}
                    label={cv.label}
                    display={cv.display}
                    copyText={cv.copyText}
                    accentHex={color.hex}
                  />
                ))}
              </div>
            </div>

            {/* 스케일 탭: Shades / Tints / Saturation */}
            <div className={activeTab !== "scale" ? "hidden" : ""}>
              <ScaleRow label="Shades" hexes={shades} />
              <ScaleRow label="Tints" hexes={tints} />
              <ScaleRow label="Saturation" hexes={saturations} />
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
