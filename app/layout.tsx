import type { Metadata } from "next";
import { Geist, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Bebas Neue: the display font powering Sonder's large-impact headings
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SoloFloor — Financial System for Freelancers",
  description: "Stop living invoice to invoice. The Feast & Famine Fix is a step-by-step financial operating system built for freelancers with variable income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
