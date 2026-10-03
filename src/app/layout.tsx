import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITZFIZZ | Scroll-Driven Hero Animation",
  description:
    "Premium scroll-driven car animation with GSAP, Next.js, and Tailwind CSS. Experience smooth, scroll-linked motion effects.",
  keywords: [
    "scroll animation",
    "GSAP",
    "Next.js",
    "car animation",
    "frontend",
    "hero section",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
