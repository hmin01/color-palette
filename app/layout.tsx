import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pantone Palette — 팬톤 컬러 팔레트",
  description: "팬톤 컬러 시스템 기반의 아름다운 컬러 팔레트 컬렉션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${jakarta.variable} font-jakarta antialiased bg-[#F0EEE9]`}>
        {children}
      </body>
    </html>
  );
}
