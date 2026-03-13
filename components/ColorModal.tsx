"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useColorModalStore } from "@/store/colorModalStore";
import {
  getTextColorForBg,
  hexToRgb,
  hexToRgbObject,
  hexToHsl,
  hexToHsb,
  generateColorScale,
} from "@/utils/color";

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
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mb-2.5">
                색상 스케일
              </p>
              <div className="flex gap-1">
                {colorScale.map(({ stop, hex }) => (
                  <ColorScaleSwatch key={stop} stop={stop} hex={hex} />
                ))}
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
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
