// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import "@/app/globals.css";

import { MainLayoutComp } from "@/components/dyncomp/MainLayout";

// Lucide icons import
import {
  Boxes, ChevronsUpDown,
  Box
} from "lucide-react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Localit | Dashboard",
//   description: "Test your webapp for ui locale errors",
// };


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0A]`}>
      <body
        className="flex flex-col font-sans h-screen w-full bg-[#0A0A0A] overflow-hidden text-white"
      >
        <MainLayoutComp />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}