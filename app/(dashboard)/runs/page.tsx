"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayersPlus, ArrowDownAZ,
  ArrowDown01, ArrowDownNarrowWide
} from "lucide-react";

import { RepoRun } from "@/components/dyncomp/Repo";

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuTrigger, DropdownMenuItem,
  DropdownMenuGroup, DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

export default function RunsPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden p-2">
      <div className="flex justify-between items-center w-full">
        <span className="font-sans tracking-[-0.05em] text-sm font-normal cursor-pointer">Runs</span>
        <div className="flex gap-x-1 items-center"> 
          <Button size="xs" variant="outline" className="bg-transparent rounded-xs border-[#2A2A2A]">
            <ArrowDownAZ size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">Filter by repo</span>
          </Button>
          <Button size="xs" variant="outline" className="bg-transparent rounded-xs border-[#2A2A2A]">
            <ArrowDown01 size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">Filter by status</span>
          </Button>
          <Button size="xs" variant="outline" className="bg-transparent rounded-xs border-[#2A2A2A]">
            <ArrowDownNarrowWide size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">Filter by date</span>
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="bg-transparent rounded-xs border-[#2A2A2A]"
            onClick={() => {
              router.push("/runs/create")
            }}
          >
            <LayersPlus size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">Create run</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-0 overflow-y-scroll border border-l-0 border-b-0 border-r-0 border-t-[#2A2A2A] h-full">
        <RepoRun
          id="1"
          name="acme/app"
          commitSHA="b333dcb"
          githubUrl="https://github.com/0x-aut/localit"
          totalLocales={10}
          totalErrors={3}
          runStatus="failed"
          runTimeStamp="2 hours ago"
          runId="run_id_slug"
        />
      </div>
    </div>
  )
}