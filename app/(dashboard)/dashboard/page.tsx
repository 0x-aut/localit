"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  VectorSquare, Activity,
  Bug, PackageCheck
} from "lucide-react";

import { RepoHealthCard } from "@/components/dyncomp/Repo"; 

export default function DashboardPage() {
  
  const repos = [
    {
      id: "1",
      name: "acme/frontend",
      githubUrl: "https://github.com/acme/frontend",
      connectedAt: "13/06/2026",
      totalRuns: 24,
      lastRunStatus: "passed" as const,
      sparklineData: [87, 90, 85, 92, 94, 89, 95, 97, 94, 98],
      locales: [
        { country: "France", code: "FR", flag: "FR", coverage: 100 },
        { country: "Japan", code: "JP", flag: "JP", coverage: 95 },
        { country: "Germany", code: "DE", flag: "DE", coverage: 98 }
      ],
    },
    {
      id: "2",
      name: "acme/marketing",
      githubUrl: "https://github.com/acme/marketing",
      connectedAt: "02/05/2026",
      totalRuns: 8,
      lastRunStatus: "failed" as const,
      sparklineData: [98, 94, 91, 88, 85, 82, 79, 75, 71, 68],
      locales: [
        { country: "Spain", code: "ES", flag: "ES", coverage: 98 },
        { country: "Germany", code: "DE", flag: "DE", coverage: 98 }
      ],
    },
    {
      id: "3",
      name: "acme/docs",
      githubUrl: "https://github.com/acme/docs",
      connectedAt: "28/04/2026",
      totalRuns: 15,
      lastRunStatus: "passed" as const,
      sparklineData: [80, 82, 83, 85, 86, 88, 90, 91, 93, 95],
      locales: [
        { country: "France", code: "FR", flag: "FR", coverage: 100 },
        { country: "Japan", code: "JP", flag: "JP", coverage: 95 },
        { country: "Spain", code: "ES", flag: "ES", coverage: 98 },
        { country: "Germany", code: "DE", flag: "DE", coverage: 98 }
      ],
    },
    {
      id: "4",
      name: "acme/api",
      githubUrl: "https://github.com/acme/api",
      connectedAt: "15/03/2026",
      totalRuns: 3,
      lastRunStatus: "failed" as const,
      sparklineData: [95, 95, 94, 90, 88, 85, 84, 80, 78, 74],
      locales: [
        { country: "France", code: "FR", flag: "FR", coverage: 100 },
        { country: "Germany", code: "DE", flag: "DE", coverage: 98 }
      ],
    },
  ]
  
  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden p-2">
      <div className="flex justify-between items-center w-full">
        <span className="font-sans tracking-[-0.05em] text-sm font-normal cursor-pointer">Dashboard</span>
        <Button size="xs" className="bg-[#107A4D]">
          <Image src="/githubsymbol.png" alt="Github logo" width={12} height={12} />
          <span className="font-sans tracking-[-0.05em] text-xs font-normal">Connect your repo</span>
        </Button>
      </div>
      <div className="flex gap-x-4 h-[70%]">
        {/*Project details container*/}
        <div className="flex flex-col gap-y-4 w-[50%] px-10 items-start justify-center">
          <div className="flex">
            <span className="font-sans tracking-[-0.05em] font-normal text-lg">Project</span>
          </div>
          <div className="flex gap-x-10 w-full items-center">
            <div className="flex gap-x-2 items-center min-w-[50%] w-[50%] max-w-[50%]">
              <div className="px-4 py-4 border border-[#2A2A2A] rounded-sm hover:bg-[#1A1A1A]">
                <VectorSquare size={18} color="#EDEDED" />
              </div>
              <div className="flex flex-col gap-y-0.5 justify-start">
                <span className="font-sans tracking-[-0.05em] font-light text-xs text-[#A1A1A1]">Total runs</span>
                <span className="font-sans tracking-[-0.05em] font-normal text-sm text-[#EDEDED]">0 runs</span>
              </div>
            </div>
            <div className="flex gap-x-2 items-center min-w-[50%] w-[50%] max-w-[50%] ">
              <div className="px-4 py-4 border border-[#2A2A2A] rounded-sm hover:bg-[#1A1A1A]">
                <Activity size={18} color="#EDEDED" />
              </div>
              <div className="flex flex-col gap-y-0.5 justify-start">
                <span className="font-sans tracking-[-0.05em] font-light text-xs text-[#A1A1A1]">Active runs</span>
                <span className="font-sans tracking-[-0.05em] font-normal text-sm text-[#EDEDED]">0 runs</span>
              </div>
            </div>
          </div>
          <div className="flex gap-x-10 w-full items-center">
            <div className="flex gap-x-2 items-center min-w-[50%] w-[50%] max-w-[50%] ">
              <div className="px-4 py-4 border border-[#2A2A2A] rounded-sm hover:bg-[#1A1A1A]">
                <PackageCheck size={18} color="#EDEDED" />
              </div>
              <div className="flex flex-col gap-y-0.5 justify-start">
                <span className="font-sans tracking-[-0.05em] font-light text-xs text-[#A1A1A1]">Runs passed</span>
                <span className="font-sans tracking-[-0.05em] font-normal text-sm text-[#EDEDED]">0 runs</span>
              </div>
            </div>
            <div className="flex gap-x-2 items-center min-w-[50%] w-[50%] max-w-[50%] ">
              <div className="px-4 py-4 border border-[#2A2A2A] rounded-sm hover:bg-[#1A1A1A]">
                <Bug size={18} color="#EDEDED" />
              </div>
              <div className="flex flex-col gap-y-0.5 justify-start">
                <span className="font-sans tracking-[-0.05em] font-light text-xs text-[#A1A1A1]">Runs failed</span>
                <span className="font-sans tracking-[-0.05em] font-normal text-sm text-[#EDEDED]">0 runs</span>
              </div>
            </div>
          </div>
        </div>
        {/*Repos health in projects visualized*/}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {repos.slice(0, 4).map(repo => (
            <RepoHealthCard key={repo.id} {...repo} />
          ))}
        </div>
      </div>
    </div>
  )
}