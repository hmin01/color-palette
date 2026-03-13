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

// ─── 팬톤 컬러 모델 ────────────────────────────────────────────────────────────

export type PantoneColor = {
  id: string;
  code: string;
  name: string;
  hex: string;
  category: Exclude<Category, "All">;
  year?: number;
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
};

// ─── 응답 데이터 타입 (ApiResponse<T>의 T 역할) ──────────────────────────────

/** 컬러 목록 */
export type ColorListData = PantoneColor[];

/** 컬러 단건 */
export type ColorDetailData = PantoneColor;

/** 카테고리 목록 */
export type CategoryListData = string[];
