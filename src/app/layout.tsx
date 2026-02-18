import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <--- 1. Import the font
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- Keep your Toaster

// 2. Configure the font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My E-commerce Store",
  description: "A professional store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Use the font variable here */}
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}