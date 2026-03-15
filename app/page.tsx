import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import { getColorsOfTheYear } from "@/app/actions/colorActions";

export default async function Home() {
  const colors = await getColorsOfTheYear();
  const cotye_years = Array.from(
    new Set(colors.map((c) => c.year).filter((y): y is number => y !== null))
  ).sort((a, b) => a - b);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        <Header />
        <HomeClient cotye_years={cotye_years} />

        {/* 푸터 */}
        <footer className="py-10 text-center text-sm text-gray-400">
          copyright &copy; hmin
        </footer>
      </div>
    </main>
  );
}
