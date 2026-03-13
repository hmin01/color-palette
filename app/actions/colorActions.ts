"use server";

import { PANTONE_COLORS } from "./_pantone-data";
import { successResponse, errorResponse } from "@/types/api";
import type { ApiResponse, ApiMeta } from "@/types/api";
import type {
  PantoneColor,
  ColorListData,
  ColorDetailData,
  CategoryListData,
  GetColorsParams,
} from "@/types/color";

// ─── Server Actions ────────────────────────────────────────────────────────────

/**
 * 팬톤 컬러 목록 조회
 * - 카테고리 필터, 텍스트 검색, 페이지네이션 지원
 */
export async function getColors(
  params: GetColorsParams = {}
): Promise<ApiResponse<ColorListData>> {
  const { category, page = 1, pageSize = 12, search } = params;

  let filtered: PantoneColor[] = [...PANTONE_COLORS];

  if (category && category !== "All") {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const data = filtered.slice(offset, offset + pageSize);

  const meta: ApiMeta = { total, page, pageSize, totalPages };
  return successResponse<ColorListData>(data, meta);
}

/**
 * 팬톤 컬러 단건 조회
 */
export async function getColorById(
  id: string
): Promise<ApiResponse<ColorDetailData>> {
  const color = PANTONE_COLORS.find((c) => c.id === id);

  if (!color) {
    return errorResponse("NOT_FOUND", `컬러 ID "${id}"를 찾을 수 없습니다.`);
  }

  return successResponse<ColorDetailData>(color);
}

/**
 * 사용 가능한 카테고리 목록 조회
 */
export async function getCategories(): Promise<ApiResponse<CategoryListData>> {
  const categories = Array.from(
    new Set(PANTONE_COLORS.map((c) => c.category))
  ).sort();

  return successResponse<CategoryListData>(categories);
}

/**
 * 올해의 컬러(COTYE) 목록 조회
 */
export async function getColorsOfTheYear(): Promise<ApiResponse<ColorListData>> {
  const cotye = PANTONE_COLORS.filter((c) => c.year !== undefined).sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0)
  );

  return successResponse<ColorListData>(cotye);
}
