import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyAppCTA from "@/components/layout/StickyAppCTA";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in").replace(
      /\/$/,
      "",
    ),
  ),
  title: {
    default: "Oatmeal – Free Calorie Tracker & Nutrition App",
    template: "%s | Oatmeal",
  },
  description:
    "Track calories, browse nutrition facts, calorie burn data, and discover healthy meal plans. Download Oatmeal, the free calorie tracker app.",
  keywords: [
    "calorie tracker",
    "nutrition facts",
    "meal plan",
    "calorie counter app",
    "diet app",
  ],
  openGraph: {
    siteName: "Oatmeal – Calorie Tracker",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main className="min-h-screen pb-20 sm:pb-0">{children}</main>
        <Footer />
        <StickyAppCTA />
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
