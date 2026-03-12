"use client";

import { useState } from "react";
import { type PantoneColor } from "@/data/pantone-colors";
import { getTextColorForBg, hexToRgb, hexToRgbObject, hexToHsl, hexToHsb } from "@/utils/color";
import { Modal, useModalContext } from "@/components/Modal";

// ─── 모달 내 색상 값 행 ────────────────────────────────────────────────────────

type ColorValueRowProps = {
  label: string;
  display: string;
  copyText: string;
  accentColor: string;
};

function ColorValueRow({ label, display, copyText, accentColor }: ColorValueRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
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
            ? { backgroundColor: `rgba(${hexToRgb(accentColor)}, 0.12)`, color: accentColor }
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

// ─── 모달 콘텐츠 ──────────────────────────────────────────────────────────────

function PantoneColorDetail({ color }: { color: PantoneColor }) {
  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";
  const rgb = hexToRgbObject(color.hex);
  const hsl = hexToHsl(color.hex);
  const hsb = hexToHsb(color.hex);

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

  return (
    <>
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
                backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
                color: textColor,
              }}
            >
              COTYE · {color.year}
            </span>
          ) : (
            <div />
          )}

          <ModalCloseButton textColor={textColor} isLight={isLight} />
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

      {/* 색상 정보 영역 */}
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
                accentColor={color.hex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Modal.Close를 스타일링하기 위한 래퍼
function ModalCloseButton({
  textColor,
  isLight,
}: {
  textColor: string;
  isLight: boolean;
}) {
  const { close } = useModalContext();

  return (
    <button
      type="button"
      onClick={close}
      aria-label="모달 닫기"
      className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
      style={{
        backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
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
  );
}

// ─── 카드 ─────────────────────────────────────────────────────────────────────

type Props = {
  color: PantoneColor;
  index: number;
};

function HexCopyButton({ hex, accentColor }: { hex: string; accentColor: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // 모달이 열리지 않도록 이벤트 전파 차단
    e.stopPropagation();
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-1.5 transition-all duration-200"
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

// 카드 내부 - useModalContext로 직접 모달 제어
function CardInner({ color, index }: Props) {
  const { open } = useModalContext();
  const textColor = getTextColorForBg(color.hex);
  const isLight = textColor === "#1a1a1a";

  return (
    <article
      onClick={open}
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
          <HexCopyButton hex={color.hex} accentColor={color.hex} />

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

export default function ColorCard({ color, index }: Props) {
  return (
    <Modal>
      <CardInner color={color} index={index} />
      <Modal.Overlay />
      <Modal.Content>
        <PantoneColorDetail color={color} />
      </Modal.Content>
    </Modal>
  );
}
