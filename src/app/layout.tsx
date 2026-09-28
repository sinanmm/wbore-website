import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "World Book of Record Excellence | WBRE",
    template: "%s | World Book of Record Excellence",
  },
  description:
    "World Book of Record Excellence recognizes and verifies extraordinary achievements through structured standards, evidence-led review and global record recognition.",
  keywords: [
    "World Book of Record Excellence",
    "WBRE",
    "World Records",
    "Record Verification",
    "Achievement Registry",
    "Recognizing Distinction",
    "Official Certification",
  ],
  authors: [{ name: "World Book of Record Excellence" }],
  creator: "World Book of Record Excellence",
  publisher: "World Book of Record Excellence",
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: "World Book of Record Excellence | WBRE",
    description: "Where excellence becomes history. International record-recognition and achievement-verification authority.",
    url: SITE_CONFIG.url,
    siteName: "World Book of Record Excellence",
    images: [
      {
        url: "/WBRE.png",
        width: 1277,
        height: 1231,
        alt: "World Book of Record Excellence Official Emblem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Book of Record Excellence | WBRE",
    description: "Where excellence becomes history. International record-recognition and achievement-verification authority.",
    images: ["/WBRE.png"],
  },
  icons: {
    icon: "/WBRE.png",
    shortcut: "/WBRE.png",
    apple: "/WBRE.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-wbre-deepNavy text-slate-100 font-sans selection:bg-wbre-primaryGold/30 selection:text-wbre-lightGold flex flex-col">
        {children}
      </body>
    </html>
  );
}
