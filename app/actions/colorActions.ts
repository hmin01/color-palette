"use server";

import { createServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/types/api";
import type { ApiResponse, ApiMeta } from "@/types/api";
import type {
  ColorDto,
  ColorListData,
  ColorDetailData,
  CategoryListData,
  GetColorsParams,
} from "@/types/color";

// ─── Server Actions ────────────────────────────────────────────────────────────

/**
 * 팬톤 컬러 목록 조회
 * - 카테고리 필터, 연도 필터, 텍스트 검색, 페이지네이션 지원
 */
export async function getColors(
  params: GetColorsParams = {}
): Promise<ApiResponse<ColorListData>> {
  const { category, page = 1, pageSize = 12, search, year } = params;

  let supabase: ReturnType<typeof createServerClient>;
  try {
    supabase = createServerClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase 클라이언트 초기화 실패";
    console.error("[getColors]", msg);
    return errorResponse("CONFIG_ERROR", msg);
  }
  let query = supabase
    .from("pantone_colors")
    .select("*", { count: "exact" });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (year != null) {
    query = query.eq("year", year);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,code.ilike.%${search}%,hex.ilike.%${search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    return errorResponse("DB_ERROR", error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  const meta: ApiMeta = { total, page, pageSize, totalPages };

  return successResponse<ColorListData>(data as ColorDto[], meta);
}

/**
 * 팬톤 컬러 단건 조회
 */
export async function getColorById(
  id: string
): Promise<ApiResponse<ColorDetailData>> {
  let supabase: ReturnType<typeof createServerClient>;
  try {
    supabase = createServerClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase 클라이언트 초기화 실패";
    console.error("[getColorById]", msg);
    return errorResponse("CONFIG_ERROR", msg);
  }
  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return errorResponse("NOT_FOUND", `컬러 ID "${id}"를 찾을 수 없습니다.`);
  }

  return successResponse<ColorDetailData>(data as ColorDto);
}

/**
 * 사용 가능한 카테고리 목록 조회
 */
export async function getCategories(): Promise<ApiResponse<CategoryListData>> {
  let supabase: ReturnType<typeof createServerClient>;
  try {
    supabase = createServerClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase 클라이언트 초기화 실패";
    console.error("[getCategories]", msg);
    return errorResponse("CONFIG_ERROR", msg);
  }
  const { data, error } = await supabase
    .from("pantone_colors")
    .select("category");

  if (error) {
    return errorResponse("DB_ERROR", error.message);
  }

  const categories = Array.from(
    new Set((data as { category: string }[]).map((c) => c.category))
  ).sort();

  return successResponse<CategoryListData>(categories);
}

/**
 * 올해의 컬러(COTYE) 목록 조회 (연도 내림차순)
 */
export async function getColorsOfTheYear(): Promise<ApiResponse<ColorListData>> {
  let supabase: ReturnType<typeof createServerClient>;
  try {
    supabase = createServerClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase 클라이언트 초기화 실패";
    console.error("[getColorsOfTheYear]", msg);
    return errorResponse("CONFIG_ERROR", msg);
  }
  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*")
    .not("year", "is", null)
    .order("year", { ascending: false });

  if (error) {
    return errorResponse("DB_ERROR", error.message);
  }

  return successResponse<ColorListData>(data as ColorDto[]);
}
