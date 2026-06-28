import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "moonarośe floristry",
  description:
    "Floral boutique for flowers, gifts, events and little moments of magic.",
  openGraph: {
    title: "moonarośe floristry",
    description: "Flowers, gifts, events and little moments of magic.",
    siteName: "moonarośe floristry",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "moonarośe floristry",
    description: "Flowers, gifts, events and little moments of magic.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${brandFont.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
