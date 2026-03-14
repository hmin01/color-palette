import { getColorsOfTheYear } from "@/app/actions/colorActions";
import TimelineClient from "@/components/timeline/TimelineClient";
import type { Metadata } from "next";
import type { ColorDto } from "@/types/color";

// ISR: 하루 1회 재생성
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Colors of the Year — Pantone Timeline",
  description: "팬톤이 선정한 올해의 컬러 타임라인 (2000년~현재)",
};

export default async function TimelinePage() {
  const res = await getColorsOfTheYear();

  // 연도 오름차순 정렬
  const colors: ColorDto[] =
    res.success && res.data
      ? [...res.data].sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
      : [];

  return <TimelineClient colors={colors} />;
}
