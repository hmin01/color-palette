"use client";

import { useState, useRef, useCallback } from "react";
import { extractColorsFromImage } from "@/utils/colorExtract";
import { findClosestColor } from "@/app/actions/colorActions";
import { useColorModalStore } from "@/store/colorModalStore";
import type { ColorDto } from "@/types/color";

type MatchedColor = {
  extracted: string;    // 추출된 HEX
  matched: ColorDto;    // 매칭된 팬톤 컬러
};

// ─── 이미지 색상 매처 모달 ────────────────────────────────────────────────────

type ImageMatcherProps = {
  onClose: () => void;
};

export default function ImageMatcher({ onClose }: ImageMatcherProps) {
  const [results, setResults] = useState<MatchedColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openModal = useColorModalStore((s) => s.open);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // 이미지 미리보기 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    setResults([]);
    setLoading(true);

    try {
      // Canvas API로 대표색 5개 추출 (클라이언트 사이드)
      const hexes = await extractColorsFromImage(file, 5);

      // 각 대표색에 가장 가까운 팬톤 컬러 서버 액션으로 매칭
      const matched = await Promise.all(
        hexes.map(async (extracted) => {
          const res = await findClosestColor(extracted);
          return res.success && res.data ? { extracted, matched: res.data } : null;
        })
      );

      setResults(matched.filter((m): m is MatchedColor => m !== null));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">이미지 색상 매처</h2>
              <p className="text-xs text-gray-400 mt-0.5">이미지를 업로드하면 가장 가까운 팬톤 컬러를 찾아드려요</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 드롭존 */}
          <div className="px-6 pb-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragOver(false)}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? "border-gray-400 bg-gray-50 scale-[1.01]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                // 미리보기 이미지
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 업로드 미리보기는 blob URL */}
                  <img
                    src={previewUrl}
                    alt="업로드한 이미지"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-700">이미지 업로드 완료</p>
                    <p className="text-xs text-gray-400 mt-0.5">다른 이미지를 클릭해 교체</p>
                  </div>
                </div>
              ) : (
                // 빈 상태
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-600">이미지를 드래그하거나 클릭해 업로드</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP 등 지원</p>
                </div>
              )}
            </div>
          </div>

          {/* 결과 섹션 */}
          {(loading || results.length > 0) && (
            <div className="px-6 pb-6">
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-gray-400 mb-3">
                {loading ? "팬톤 컬러 매칭 중..." : "매칭된 팬톤 컬러"}
              </p>

              <div className="space-y-2.5">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-gray-100" />
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex-none" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                          <div className="h-2 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  : results.map((result, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { openModal(result.matched); onClose(); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                      >
                        {/* 추출된 원본 색상 */}
                        <div
                          className="w-10 h-10 rounded-xl flex-none shadow-sm"
                          style={{ backgroundColor: result.extracted }}
                          title={`추출된 색상: ${result.extracted}`}
                        />

                        {/* 화살표 */}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 flex-none">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>

                        {/* 매칭된 팬톤 스와치 */}
                        <div
                          className="w-10 h-10 rounded-xl flex-none shadow-sm group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: result.matched.hex }}
                        />

                        {/* 색상 정보 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold text-gray-800 truncate">
                            {result.matched.name}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">
                            {result.matched.code} · {result.matched.hex.toUpperCase()}
                          </p>
                        </div>

                        {/* 상세 보기 화살표 */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-gray-500 transition-colors flex-none">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
