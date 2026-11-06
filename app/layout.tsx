import type { Metadata } from "next";
import "@/styles/style.css";
import "@/styles/mediaqueries.css";
import "@/styles/lego.css";
import "@/styles/decor.css";
import "@/styles/work.css";
import "@/styles/about.css";
import "@/styles/skills.css";
import "@/styles/contact.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Ebenezer Obi — software, data and AI engineer.",
  icons: { icon: "/Assets/ebze-head.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Inter+Tight:wght@900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
