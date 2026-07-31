import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Couple Habit",
    template: "%s | Couple Habit"
  },
  description: "Theo dõi thói quen hằng ngày cho hai người.",
  applicationName: "Couple Habit",
  appleWebApp: {
    capable: true,
    title: "Couple Habit",
    statusBarStyle: "black-translucent"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#201f3b"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
