import { getColorsOfTheYear } from "@/app/actions/colorActions";
import TimelineClient from "@/components/timeline/TimelineClient";
import type { Metadata } from "next";

// ISR: 하루 1회 재생성
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Colors of the Year — Pantone Timeline",
  description: "팬톤이 선정한 올해의 컬러 타임라인 (2000년~현재)",
};

export default async function TimelinePage() {
  const colors = await getColorsOfTheYear();

  return <TimelineClient colors={colors} />;
}
