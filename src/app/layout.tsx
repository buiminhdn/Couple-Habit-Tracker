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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3f9" },
    { media: "(prefers-color-scheme: dark)", color: "#17141d" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,300..700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
