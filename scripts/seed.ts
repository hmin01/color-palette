/**
 * 팬톤 컬러 데이터를 Supabase에 시딩하는 스크립트
 *
 * 실행 방법:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm tsx scripts/seed.ts
 */
import { createClient } from "@supabase/supabase-js";
import { PANTONE_COLORS } from "../data/pantone-colors";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "환경 변수 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정하세요."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  const rows = PANTONE_COLORS.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    hex: c.hex,
    category: c.category,
    year: c.year ?? null,
  }));

  const { error } = await supabase
    .from("pantone_colors")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("시딩 실패:", error.message);
    process.exit(1);
  }

  console.log(`${rows.length}개 색상 시딩 완료`);
}

seed();
