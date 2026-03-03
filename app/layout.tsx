import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Lịch Âm Việt",
  description: "Ứng dụng lịch âm dương lịch Việt Nam — tra cứu ngày âm, Can Chi, Hoàng Đạo, sự kiện cá nhân",
  keywords: ["lịch âm", "âm lịch", "lịch Việt Nam", "can chi", "hoàng đạo", "lịch vạn niên"],
  authors: [{ name: "Lịch Âm Việt" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lịch Âm",
  },
  openGraph: {
    title: "Lịch Âm Việt",
    description: "Ứng dụng lịch âm dương lịch Việt Nam",
    locale: "vi_VN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B1A1A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lịch Âm" />
      </head>
      <body>
        <main className="pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
