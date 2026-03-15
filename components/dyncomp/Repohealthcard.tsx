import Image from "next/image";
import Link from "next/link";

import { Sparkline } from "./Sparkline";

type RepoHealthCardProps = {
  id: string
  name: string
  githubUrl: string
  connectedAt: string
  totalRuns: number
  lastRunStatus: "passed" | "failed" | null;
  sparklineData: number[];
  locales: {
    country: string
    code: string
    flag: string
    coverage: number
  }[]
}

export function RepoHealthCard() {
  return (
    <div className="flex flex-col gap-y-2 px-1 py-1 border rounded-sm bg-[#1A1A1A] border-[#2A2A2A]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-0.5">
          <div className="flex gap-x-2 items-center">
            <span className="font-sans text-base font-normal tracking-[-0.05em]">Repo name</span>
            <Link
              href="/"
              target="_blank"
            >
              <Image src="/githubsymbol.png" alt="Github logo" width={12} height={12} />
            </Link>
            
          </div>
          <div className="flex gap-x-0.75">
            {/*Passed will be dynamic*/}
            <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Last run</span>
            <span className="font-sans text-xs font-light tracking-[-0.05em]">passed</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-0.5">
          <Sparkline data={[70, 74, 76, 88, 50, 82, 66, 75, 77, 90]} width={60} height={24} />
          {/*<span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">15 total runs</span>*/}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-0.5 h-full">
        {/*The locales will be displayed as a grid of 2 by 2*/}
        <div className="flex flex-col gap-y-0.5">
          <div className="flex gap-y-2 w-full h-[50%] items-center justify-between bg-[#111111] py-1 px-1 rounded-xs">
            <div className="flex flex-col gap-y-0.5">
              <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#A1A1A1]">Country</span>
              <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Code</span>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Image src="https://flagsapi.com/BE/flat/16.png" alt="country flag" width={16} height={16} priority />
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">90</span>
            </div>
          </div>
          <div className="flex gap-y-2 w-full h-[50%] items-center justify-between bg-[#111111] py-1 px-1 rounded-xs">
            <div className="flex flex-col gap-y-0.5">
              <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#A1A1A1]">Country</span>
              <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Code</span>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Image src="https://flagsapi.com/BE/flat/16.png" alt="country flag" width={16} height={16} priority />
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">90</span>
            </div>
          </div>
        </div>
        {/*Test*/}
        <div className="flex flex-col gap-y-0.5">
          <div className="flex gap-y-2 w-full h-[50%] items-center justify-between bg-[#111111] py-1 px-1 rounded-xs">
            <div className="flex flex-col gap-y-0.5">
              <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#A1A1A1]">Country</span>
              <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Code</span>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Image src="https://flagsapi.com/BE/flat/16.png" alt="country flag" width={16} height={16} priority />
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">90</span>
            </div>
          </div>
          <div className="flex gap-y-2 w-full h-[50%] items-center justify-between bg-[#111111] py-1 px-1 rounded-xs">
            <div className="flex flex-col gap-y-0.5">
              <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#A1A1A1]">Country</span>
              <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Code</span>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Image src="https://flagsapi.com/BE/flat/16.png" alt="country flag" width={16} height={16} priority />
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">90</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}