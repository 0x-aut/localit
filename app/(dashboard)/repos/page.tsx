"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Sparkline } from "@/components/dyncomp/Sparkline";
import { RepoRow } from "@/components/dyncomp/Repo";

import { Trash } from "lucide-react";
import { Slabo_13px } from "next/font/google";



export default function RepoPage() {
  
  const isRepo = false;
  
  
  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden p-2">
      <div className="flex justify-between items-center w-full">
        <span className="font-sans tracking-[-0.05em] text-sm font-normal cursor-pointer">Repositories</span>
        <Button size="xs" className="bg-[#107A4D]">
          <Image src="/githubsymbol.png" alt="Github logo" width={12} height={12} />
          <span className="font-sans tracking-[-0.05em] text-xs font-normal">Connect your repo</span>
        </Button>
      </div>
      <div className="flex flex-col gap-y-4 w-full border border-l-0 border-b-0 border-r-0 border-t-[#2A2A2A] h-full overflow-y-auto overflow-x-hidden">
        { isRepo ?
          <RepoRow
            id="run_one"
            name="Demo repo"
            githubUrl="https://github.com/0x-aut/localit"
            connectedAt="13/06/2026"
            totalRuns={10}
            lastRunStatus={"failed"}
            sparklineData={[98, 94, 34, 88, 50, 82, 66, 75, 67, 68]}
            onDelete={() => alert("delete")}
          />
          :
          <div className="flex flex-col w-full h-full gap-y-3 justify-center items-center">
            <span className="font-sans tracking-[-0.05em] text-lg font-normal">
              No repositories connected, consider adding a repository to see details
            </span>
            <Button size="lg" className="bg-[#107A4D]">
              <Image src="/githubsymbol.png" alt="Github logo" width={16} height={16} />
              <span className="font-sans tracking-[-0.05em] text-base font-normal">Connect your repo</span>
            </Button>
          </div>
        }
        
      </div>
    </div>
  )
}