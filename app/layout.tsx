import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Lumière — Premium Skincare",
  description:
    "Discover your perfect skincare routine with AI-powered recommendations. Authentic Korean and global skincare, fast delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-textdark antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
