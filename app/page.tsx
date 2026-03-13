import Header from "@/components/Header";
import ColorPalette from "@/components/ColorPalette";
import { getColors } from "@/app/actions/colorActions";

export default async function Home() {
  const result = await getColors({ pageSize: 10000 });
  const colors = result.data ?? [];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        <Header />
        <ColorPalette colors={colors} />

        {/* 푸터 */}
        <footer className="py-10 text-center text-sm text-gray-400">
          copyright &copy; hmin
        </footer>
      </div>
    </main>
  );
}
