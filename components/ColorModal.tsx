"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useColorModalStore } from "@/store/colorModalStore";
import { getSimilarColors } from "@/app/actions/colorActions";
import {
  getTextColorForBg,
  hexToRgb,
  hexToRgbObject,
  hexToHsl,
  hexToHsb,
  generateColorScale,
  getContrastRatio,
  getWcagGrade,
} from "@/utils/color";
import type { ColorDto } from "@/types/color";

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
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
      <span className="text-[11px] font-extrabold tracking-wider text-gray-400 w-8 shrink-0">
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
            ? {
                backgroundColor: `rgba(${hexToRgb(accentHex)}, 0.12)`,
                color: accentHex,
              }
            : {}
        }
      >
        {copied ? (
          "복사됨"
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 group-hover:text-gray-500 transition-colors"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── WCAG 대비율 뱃지 ─────────────────────────────────────────────────────────

type ContrastBadgeProps = {
  label: string;        // "vs ⬜" or "vs ⬛"
  ratio: number;
  grade: "AAA" | "AA" | "fail";
};

function ContrastBadge({ label, ratio, grade }: ContrastBadgeProps) {
  // 등급별 뱃지 스타일
  const badgeStyle: Record<"AAA" | "AA" | "fail", string> = {
    AAA: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    AA: "bg-blue-50 text-blue-700 ring-blue-200",
    fail: "bg-gray-50 text-gray-400 ring-gray-200",
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ring-1 ${badgeStyle[grade]}`}>
      <span className="text-[10px] font-bold">{label}</span>
      <span className="font-mono text-[10px] font-extrabold">
        {ratio.toFixed(1)}:1
      </span>
      <span className={`text-[9px] font-extrabold tracking-wider ${grade === "fail" ? "opacity-60" : ""}`}>
        {grade === "fail" ? "FAIL" : grade}
      </span>
    </div>
  );
}

// ─── 유사 색상 섹션 ───────────────────────────────────────────────────────────

type SimilarColorsSectionProps = {
  hex: string;
  excludeId: string;
};

function SimilarColorsSection({ hex, excludeId }: SimilarColorsSectionProps) {
  const [similar, setSimilar] = useState<ColorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const open = useColorModalStore((s) => s.open);

  // hex 또는 excludeId 변경 시 유사 색상 재조회
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSimilar([]);

    getSimilarColors(hex, excludeId, 5).then((res) => {
      if (!cancelled && res.success && res.data) {
        setSimilar(res.data);
      }
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [hex, excludeId]);

  return (
    <div className="mt-5">
      <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mb-3">
        비슷한 팬톤 컬러
      </p>

      {/* 수평 스크롤 칩 리스트 */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {loading
          ? // 스켈레톤 5개
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-none flex flex-col items-center gap-1.5 animate-pulse"
              >
                <div className="w-11 h-11 rounded-2xl bg-gray-100" />
                <div className="w-12 h-2 bg-gray-100 rounded" />
              </div>
            ))
          : similar.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => open(color)}
                title={`${color.name} · ${color.code}`}
                className="flex-none flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-11 h-11 rounded-2xl shadow-sm transition-transform group-hover:scale-110 group-hover:-translate-y-0.5"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors text-center leading-tight w-12 truncate">
                  {color.name}
                </span>
              </button>
            ))}
      </div>
    </div>
  );
}

// ─── 색상 스케일 전체 복사 버튼 ──────────────────────────────────────────────

type CopyScaleButtonProps = {
  colorScale: { stop: number; hex: string }[];
};

function CopyScaleButton({ colorScale }: CopyScaleButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const obj = Object.fromEntries(
      colorScale.map(({ stop, hex }) => [String(stop), hex.toUpperCase()])
    );
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
    >
      {copied ? "✓ 복사됨" : "전체 복사"}
    </button>
  );
}

// ─── 색상 스케일 스와치 ───────────────────────────────────────────────────────

function ColorScaleSwatch({ stop, hex }: { stop: number; hex: string }) {
  const [copied, setCopied] = useState(false);
  const isBase = stop === 500;

  const handleClick = () => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${stop} · ${hex.toUpperCase()}`}
      className="flex-1 flex flex-col items-center group"
    >
      {/* 캐럿 + 스와치를 같은 transform 컨테이너에 묶어 hover 시 함께 이동 */}
      <div className="w-full flex flex-col items-center transition-transform group-hover:scale-105 group-hover:-translate-y-0.5">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`mb-0.5 transition-opacity duration-150 ${isBase && !copied ? "opacity-100" : "opacity-0"}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke={hex}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="w-full h-10 rounded-lg shadow-sm"
          style={{ backgroundColor: hex }}
        />
      </div>
      <span
        className={`text-[9px] font-bold mt-1 transition-colors ${
          isBase ? "font-extrabold" : "text-gray-400 group-hover:text-gray-600"
        }`}
        style={isBase && !copied ? { color: hex } : undefined}
      >
        {copied ? "✓" : stop}
      </span>
    </button>
  );
}

// ─── 전역 컬러 모달 ───────────────────────────────────────────────────────────

export default function ColorModal() {
  const isOpen = useColorModalStore((s) => s.isOpen);
  const selectedColor = useColorModalStore((s) => s.selectedColor);
  const close = useColorModalStore((s) => s.close);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !selectedColor) return null;

  const color = selectedColor;
  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";
  const rgb = hexToRgbObject(color.hex);
  const hsl = hexToHsl(color.hex);
  const hsb = hexToHsb(color.hex);

  const colorScale = generateColorScale(color.hex);

  // WCAG 대비율 계산 (흰/검 배경 기준)
  const contrastWhite = getContrastRatio(color.hex, "#ffffff");
  const contrastBlack = getContrastRatio(color.hex, "#000000");
  const gradeWhite = getWcagGrade(contrastWhite);
  const gradeBlack = getWcagGrade(contrastBlack);

  const colorValues = [
    {
      label: "HEX",
      display: color.hex.toUpperCase(),
      copyText: color.hex.toUpperCase(),
    },
    {
      label: "RGB",
      display: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      copyText: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    },
    {
      label: "HSB",
      display: `${hsb.h}°, ${hsb.s}%, ${hsb.b}%`,
      copyText: `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`,
    },
    {
      label: "HSL",
      display: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`,
      copyText: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    },
  ];

  return createPortal(
    <>
      {/* Backdrop - 클릭 시 모달 닫기 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />

      {/* 패널 래퍼 - pointer-events-none으로 클릭이 backdrop까지 통과 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        <div className="pointer-events-auto w-full max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-slide-up">
          {/* 컬러 스와치 헤더 */}
          <div
            className="h-44 flex flex-col justify-between p-5 rounded-t-3xl"
            style={{ backgroundColor: color.hex }}
          >
            <div className="flex items-start justify-between">
              {color.year ? (
                <span
                  className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: isLight
                      ? "rgba(0,0,0,0.12)"
                      : "rgba(255,255,255,0.25)",
                    color: textColor,
                  }}
                >
                  COTYE · {color.year}
                </span>
              ) : (
                <div />
              )}

              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={close}
                aria-label="모달 닫기"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: isLight
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(255,255,255,0.2)",
                  color: textColor,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <p
                className="font-mono text-[10px] font-bold tracking-widest opacity-60"
                style={{ color: textColor }}
              >
                PANTONE
              </p>
              <p
                className="font-mono text-2xl font-extrabold leading-tight"
                style={{ color: textColor }}
              >
                {color.code}
              </p>
            </div>
          </div>

          {/* 색상 정보 */}
          <div className="p-5">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {color.name}
            </h2>

            <div className="flex gap-2 mt-2.5">
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `rgba(${hexToRgb(color.hex)}, 0.12)`,
                  color: color.hex,
                }}
              >
                {color.category}
              </span>
              {color.year && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                  {color.year}
                </span>
              )}
            </div>

            {/* 색상 스케일 (0–900) */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400">
                  색상 스케일
                </p>
                <CopyScaleButton colorScale={colorScale} />
              </div>
              <div className="flex gap-1">
                {colorScale.map(({ stop, hex }) => (
                  <ColorScaleSwatch key={stop} stop={stop} hex={hex} />
                ))}
              </div>
            </div>

            {/* WCAG 접근성 대비율 */}
            <div className="mt-5">
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mb-2.5">
                접근성 대비율
              </p>
              <div className="flex gap-2 flex-wrap">
                <ContrastBadge
                  label="vs ⬜"
                  ratio={contrastWhite}
                  grade={gradeWhite}
                />
                <ContrastBadge
                  label="vs ⬛"
                  ratio={contrastBlack}
                  grade={gradeBlack}
                />
              </div>
            </div>

            {/* 색상 값 테이블 */}
            <div className="mt-5">
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mb-2">
                색상 값
              </p>
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

            {/* 유사 팬톤 컬러 */}
            <SimilarColorsSection hex={color.hex} excludeId={color.id} />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
