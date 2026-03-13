// ─── 카테고리 ─────────────────────────────────────────────────────────────────

export type Category =
  | "All"
  | "Warm"
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Blue"
  | "Purple"
  | "Pink"
  | "Neutral";

export const CATEGORIES: Category[] = [
  "All",
  "Warm",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "Neutral",
];

// ─── 정적 데이터 타입 (data/ 레이어 전용) ────────────────────────────────────

/** 정적 데이터 파일(_pantone-data.ts) 및 시딩 스크립트에서 사용하는 원본 타입 */
export type PantoneColor = {
  id: string;
  code: string;
  name: string;
  hex: string;
  category: Exclude<Category, "All">;
  year?: number;
};

// ─── 컬러 데이터 DTO ──────────────────────────────────────────────────────────

/** API 계층에서 사용하는 팬톤 컬러 DTO */
export type ColorDto = {
  id: string;
  code: string;
  name: string;
  hex: string;
  category: Exclude<Category, "All">;
  /** 올해의 컬러(COTYE)로 지정된 연도. 미지정 시 null */
  year: number | null;
};

// ─── 요청 파라미터 ─────────────────────────────────────────────────────────────

/** 컬러 목록 조회 요청 파라미터 */
export type GetColorsParams = {
  /** 카테고리 필터 ("All" 또는 특정 카테고리명) */
  category?: string;
  /** 페이지 번호 (1부터 시작, 기본값 1) */
  page?: number;
  /** 페이지 당 항목 수 (기본값 12) */
  pageSize?: number;
  /** 이름·코드·헥스 통합 검색어 */
  search?: string;
  /** 올해의 컬러 연도 필터 */
  year?: number | null;
};

// ─── 응답 데이터 타입 (ApiResponse<T>의 T 역할) ──────────────────────────────

/** 컬러 목록 */
export type ColorListData = ColorDto[];

/** 컬러 단건 */
export type ColorDetailData = ColorDto;

/** 카테고리 목록 */
export type CategoryListData = string[];
