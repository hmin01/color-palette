// ─── 공통 API 응답 타입 ────────────────────────────────────────────────────────

/** 모든 API 응답의 기본 구조 */
export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ApiMeta | null;
};

/** API 에러 정보 */
export type ApiError = {
  code: string;
  message: string;
};

/** 페이지네이션 메타데이터 */
export type ApiMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ─── 응답 생성 헬퍼 ────────────────────────────────────────────────────────────

/** 성공 응답 생성 */
export function successResponse<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  return { success: true, data, error: null, meta: meta ?? null };
}

/** 에러 응답 생성 */
export function errorResponse<T>(
  code: string,
  message: string
): ApiResponse<T> {
  return { success: false, data: null, error: { code, message }, meta: null };
}
