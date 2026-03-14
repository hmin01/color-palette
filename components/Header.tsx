"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getColorsOfTheYear } from "@/app/actions/colorActions";

export default function Header() {
  const [previewHexes, setPreviewHexes] = useState<string[]>([]);

  useEffect(() => {
    getColorsOfTheYear().then((res) => {
      if (res.success && res.data) {
        setPreviewHexes(res.data.slice(0, 8).map((c) => c.hex));
      }
    });
  }, []);


  return (
    <header className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-sm px-8 py-12 md:px-14 md:py-16">
      {/* 배경 블롭 장식 */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 opacity-40 blur-3xl animate-blob" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-200 to-indigo-300 opacity-35 blur-3xl animate-blob [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 opacity-25 blur-2xl animate-blob [animation-delay:4s]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          {/* 상단 배지 */}
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Pantone Color System
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 leading-[0.9] tracking-tighter">
            Color
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
              Palette
            </span>
          </h1>

          {/* 서브타이틀 */}
          <p className="mt-5 text-gray-500 text-base md:text-lg font-medium max-w-sm leading-relaxed">
            팬톤 컬러 시스템이 선정한 아름다운 컬러 팔레트 컬렉션
          </p>
        </div>

        {/* 우측 COTYE 스와치 섹션 */}
        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Colors of the Year
            </p>
            <Link
              href="/timeline"
              className="text-[10px] font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              전체 보기
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 max-w-[280px] md:justify-end">
            {previewHexes.map((hex, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-2xl shadow-sm transition-transform hover:scale-110 hover:-translate-y-0.5"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 통계 바 */}
      <div className="relative z-10 flex gap-8 mt-10 pt-8 border-t border-gray-100">
        <div>
          <p className="text-3xl font-extrabold text-gray-900">80+</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">팬톤 컬러</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-gray-900">9</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">카테고리</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-gray-900">24+</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">올해의 컬러</p>
        </div>
      </div>
    </header>
  );
}
