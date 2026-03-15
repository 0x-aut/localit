"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/dyncomp/Sparkline";
import { RepoRowProps, RepoHealthCardProps, RepoRunProps } from "@/types/repo";

export function RepoRow({
  id,
  name,
  githubUrl,
  connectedAt,
  totalRuns,
  lastRunStatus,
  sparklineData,
  onDelete,
}: RepoRowProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/repos/${id}`)}
      className="flex w-full justify-between items-center cursor-pointer border border-t-0 border-b-[#2A2A2A] border-l-0 border-r-0 py-3 px-2"
    >
      {/* Repo name + GitHub link */}
      <div className="flex gap-x-2.5 items-center w-[15%] max-w-[20%] justify-start">
        <span className="font-sans tracking-[-0.05em] font-normal text-base text-left">
          {name}
        </span>
        <Link
          href={githubUrl}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src="/githubsymbol.png"
            alt="Github logo"
            width={12}
            height={12}
          />
        </Link>
      </div>

      {/* Date connected */}
      <div className="flex items-center w-[7%] max-w-[7%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-xs text-left font-light text-[#A1A1A1]">
          {connectedAt}
        </span>
      </div>

      {/* Total runs */}
      <div className="flex items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          {totalRuns} total run{totalRuns !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Last run status */}
      <div className="flex gap-x-1 items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          Last run
        </span>
        {lastRunStatus === null ? (
          <span className="font-sans tracking-[-0.05em] text-sm text-[#555555]">
            none
          </span>
        ) : (
          <span
            className={`font-sans tracking-[-0.05em] text-sm ${
              lastRunStatus === "passed" ? "text-[#22C55E]" : "text-[#EF4444]"
            }`}
          >
            {lastRunStatus}
          </span>
        )}
      </div>

      {/* Sparkline */}
      <div className="flex items-center">
        <Sparkline data={sparklineData} width={50} height={24} />
      </div>

      {/* Delete */}
      <div className="flex items-center">
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash size={12} />
        </Button>
      </div>
    </div>
  );
}


export function RepoHealthCard({
  id,
  name,
  githubUrl,
  connectedAt,
  totalRuns,
  lastRunStatus,
  sparklineData,
  locales,
}: RepoHealthCardProps) {
  return (
    <div className="flex flex-col gap-y-2 px-1 py-1 border rounded-sm bg-[#1A1A1A] border-[#2A2A2A]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-0.5">
          <div className="flex gap-x-2 items-center">
            <span className="font-sans text-base font-normal tracking-[-0.05em]">{name}</span>
            <Link
              href={githubUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src="/githubsymbol.png" alt="Github logo" width={12} height={12} />
            </Link>
            
          </div>
          <div className="flex gap-x-0.75">
            {/*Passed will be dynamic*/}
            <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">Last run</span>
            {lastRunStatus === null ? (
              <span className="font-sans tracking-[-0.05em] text-xs text-[#555555]">
                none
              </span>
            ) : (
              <span
                className={`font-sans tracking-[-0.05em] text-xs ${
                  lastRunStatus === "passed" ? "text-[#22C55E]" : "text-[#EF4444]"
                }`}
              >
                {lastRunStatus}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-0.5">
          <Sparkline data={sparklineData} width={60} height={24} />
          {/*<span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">15 total runs</span>*/}
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
        {/*The locales will be displayed as a grid of 2 by 2*/}
        {locales.map((locale) => (
          <div key={locale.code} className="flex gap-y-2 w-full items-center justify-between bg-[#111111] py-1 px-1 rounded-xs">
            <div className="flex flex-col gap-y-0.5">
              <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#A1A1A1]">{locale.country}</span>
              <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#A1A1A1]">{locale.code}</span>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Image src={`https://flagsapi.com/${locale.flag}/flat/16.png`} alt={`${locale.country} flag`} width={16} height={16} priority />
              <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">90</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export function RepoRun({
  id,
  name,
  commitSHA,
  githubUrl,
  totalLocales,
  totalErrors,
  runStatus,
  runTimeStamp,
  runId,
}: RepoRunProps
) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/runs/${runId}`)}
      className="flex w-full justify-between items-center cursor-pointer border border-t-0 border-b-[#2A2A2A] border-l-0 border-r-0 py-3 px-2"
    >
      {/* Repo name + GitHub link */}
      <div className="flex gap-x-2.5 items-center w-[15%] max-w-[20%] justify-start">
        <span className="font-sans tracking-[-0.05em] font-normal text-base text-left">
          {name}
        </span>
        <Link
          href={githubUrl}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src="/githubsymbol.png"
            alt="Github logo"
            width={12}
            height={12}
          />
        </Link>
      </div>
      
      {/* Total runs */}
      <div className="flex items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-mono tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          {commitSHA}
        </span>
      </div>

      {/* Total runs */}
      <div className="flex items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          {totalLocales} total locale{totalLocales !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Last run status */}
      <div className="flex gap-x-1 items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          Last run
        </span>
        {runStatus === null ? (
          <span className="font-sans tracking-[-0.05em] text-sm text-[#555555]">
            none
          </span>
        ) : (
          <span
            className={`font-sans tracking-[-0.05em] text-sm ${
              runStatus === "passed" ? "text-[#22C55E]" : "text-[#EF4444]"
            }`}
          >
            {runStatus}
          </span>
        )}
      </div>
      
      <div className="flex items-center w-[10%] max-w-[12.5%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-sm text-[#A1A1A1] text-left">
          {totalErrors} total error{totalErrors !== 1 ? "s" : ""}
        </span>
      </div>
      
      {/* Date connected */}
      <div className="flex items-center w-[7%] max-w-[7%] justify-start">
        <span className="font-sans tracking-[-0.05em] text-xs text-left font-light text-[#A1A1A1]">
          {runTimeStamp}
        </span>
      </div>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#A1A1A1]"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/run/${runId}`)
          }}
        >
          <SquareArrowOutUpRight />
        </Button>
      </div>
      
    </div>
  )
}