import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

// Croftly type system — Sora (headings) + Inter (body), per the design tokens
// in /design-reference/Croftly Foundations (standalone).html.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Croftly — local farms, direct to your door",
  description:
    "Croftly connects local UK farmers directly to households. Tell us your food intent; we compose a box from real farm supply. Fresher, fairer, less waste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
