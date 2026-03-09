import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import "@/app/globals.css";

// Shadcn Components import
import { Button } from "@/components/ui/button"

import {
  PanelRight, Blocks,
  BriefcaseBusiness, CreditCard,
  Settings2, Workflow
} from "lucide-react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witness App",
  description: "The system has lawyers. Now you have Witness.",
};


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
      <body
        className="flex font-sans h-screen w-full bg-white overflow-hidden"
      >
        <aside className="flex flex-col justify-between w-50 pl-3 pr-3 pb-3 h-screen gap-y-1 border-r">
          <div className="">
            <div className="flex pt-2.5 pb-2.5 pl-0 pr-0 justify-between items-center">
              <Link href="/" className="">
                <Image src="/witness-logo.svg" width={77} height={18} alt="Witness logo" />
              </Link>
              <Button size="icon-sm" variant="ghost">
                <PanelRight strokeWidth={1.5} size={14} />
              </Button>
            </div>
            <div className="flex flex-col gap-y-1">
              <Link href="/assistant" className="flex border rounded-sm gap-x-2.5 items-center justify-start p-1.25 bg-[#D9D9D9]">
                <Blocks size={18} color="#121212" strokeWidth={1.5} />
                <span className="font-sans text-sm font-normal tracking-[-0.05em]">Dashboard</span>
              </Link>
              <Link href="/" className="flex rounded-lg gap-x-2.5 items-center justify-start p-1.25">
                <BriefcaseBusiness size={18} color="#121212" strokeWidth={1.5} />
                <span className="font-sans text-sm font-normal tracking-[-0.05em]">Runs</span>
              </Link>
              <Link href="/" className="flex rounded-lg gap-x-2.5 items-center justify-start p-1.25">
                <Workflow size={18} color="#121212" strokeWidth={1.5} />
                <span className="font-sans text-sm font-normal tracking-[-0.05em]">Workflow</span>
              </Link>
            </div>
        </div>
          <div className="">
            <Link href="/" className="flex rounded-lg gap-x-2.5 items-center justify-start p-1.25">
              <CreditCard size={18} color="#121212" strokeWidth={1.5} />
              <span className="font-sans text-sm font-normal tracking-[-0.05em]">Billing</span>
            </Link>
            <Link href="/" className="flex rounded-lg gap-x-2.5 items-center justify-start p-1.25">
              <Settings2 size={18} color="#121212" strokeWidth={1.5} />
              <span className="font-sans text-sm font-normal tracking-[-0.05em]">Settings</span>
            </Link>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}