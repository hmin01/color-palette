import { createClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase 클라이언트 생성
 * Server Actions / Route Handlers 에서만 사용
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase 대시보드 신규 명칭(Publishable key)과 구 명칭(anon key) 모두 지원
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. .env.local.example을 참고하세요."
    );
  }

  return createClient(url, key);
}
