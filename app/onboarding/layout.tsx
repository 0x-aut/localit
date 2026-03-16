"use client";

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import "@/app/globals.css";
import { signOut } from "@/app/actions/auth";

// Shadcn Components import
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
        <nav className="flex w-full justify-between h-10 pl-2 pr-2 items-center border-b border-[#2A2A2A]">
          <Link href="/">Home</Link>
          {/*This will contains the avatar icon with account dropdown*/}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar size="sm" className="bg-[#1A1A1A] border border-[#D9D9D9] cursor-pointer">
                  <AvatarImage src="/githubsymbol.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1A1A] text-[#EDEDED]">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}