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
import { getRgbDistance } from "@/utils/color";

// ─── 내부 헬퍼 ────────────────────────────────────────────────────────────────

/**
 * Supabase 클라이언트 초기화 헬퍼
 * - 초기화 실패 시 console.error 후 null 반환
 * - 각 action 함수는 null 여부를 확인 후 적절한 fallback 반환
 */
function initSupabase(label: string) {
  try {
    return createServerClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase 클라이언트 초기화 실패";
    console.error(`[${label}] 클라이언트 초기화 오류:`, msg);
    return null;
  }
}

// ─── Server Actions ────────────────────────────────────────────────────────────

/**
 * 팬톤 컬러 목록 조회
 * - 카테고리 필터, 연도 필터, 텍스트 검색, 페이지네이션 지원
 */
export async function getColors(
  params: GetColorsParams = {}
): Promise<ApiResponse<ColorListData>> {
  const { category, page = 1, pageSize = 12, search, year } = params;

  const supabase = initSupabase("getColors");
  if (!supabase) return errorResponse("CONFIG_ERROR", "Supabase 클라이언트 초기화 실패");

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
  const supabase = initSupabase("getColorById");
  if (!supabase) return errorResponse("CONFIG_ERROR", "Supabase 클라이언트 초기화 실패");

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
  const supabase = initSupabase("getCategories");
  if (!supabase) return errorResponse("CONFIG_ERROR", "Supabase 클라이언트 초기화 실패");

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
 * RGB 유클리드 거리 기준 유사 팬톤 컬러 조회
 * - 전체 색상을 로드 후 거리 계산 및 정렬
 * - excludeId: 현재 색상 자신 제외
 * - limit: 반환할 최대 개수 (기본값 5)
 */
export async function getSimilarColors(
  hex: string,
  excludeId: string,
  limit = 5
): Promise<ApiResponse<ColorListData>> {
  const supabase = initSupabase("getSimilarColors");
  if (!supabase) return errorResponse("CONFIG_ERROR", "Supabase 클라이언트 초기화 실패");

  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*")
    .neq("id", excludeId);

  if (error) {
    return errorResponse("DB_ERROR", error.message);
  }

  // RGB 거리 계산 후 오름차순 정렬, 상위 limit 개 반환
  const sorted = (data as ColorDto[])
    .map((color) => ({ color, distance: getRgbDistance(hex, color.hex) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ color }) => color);

  return successResponse<ColorListData>(sorted);
}

/**
 * 올해의 컬러(COTYE) 목록 조회 (연도 내림차순)
 */
export async function getColorsOfTheYear(): Promise<ColorDto[]> {
  const supabase = initSupabase("getColorsOfTheYear");
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*")
    .not("year", "is", null)
    .order("year", { ascending: false });

  if (error) {
    console.error("[getColorsOfTheYear] DB 조회 오류:", error.message);
    return [];
  }

  return data as ColorDto[];
}

/**
 * 주어진 HEX 색상과 RGB 거리가 가장 가까운 팬톤 컬러 1개 반환
 * 이미지 색상 매처에서 추출된 대표색 → 팬톤 매칭에 사용
 */
export async function findClosestColor(
  hex: string
): Promise<ApiResponse<ColorDetailData>> {
  const supabase = initSupabase("findClosestColor");
  if (!supabase) return errorResponse("CONFIG_ERROR", "Supabase 클라이언트 초기화 실패");

  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*");

  if (error) {
    return errorResponse("DB_ERROR", error.message);
  }

  // RGB 거리 최솟값 색상 1개 반환
  const closest = (data as ColorDto[]).reduce<{ color: ColorDto | null; dist: number }>(
    (acc, color) => {
      const dist = getRgbDistance(hex, color.hex);
      return dist < acc.dist ? { color, dist } : acc;
    },
    { color: null, dist: Infinity }
  );

  if (!closest.color) {
    return errorResponse("NOT_FOUND", "매칭되는 컬러를 찾을 수 없습니다.");
  }

  return successResponse<ColorDetailData>(closest.color);
}
