"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RouteView } from "@/components/dyncomp/Routelist";
import { LocalePanel } from "@/components/dyncomp/Localecard";
import { MissingKeysTable } from "@/components/dyncomp/Missingkeys";

export default function RunIdPage() {
  const [selectedLocale, setSelectedLocale] = useState("de");
  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden overflow-y-scroll p-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-x-2 items-center">
          <span className="font-sans tracking-[-0.05em] text-base font-normal cursor-pointer">acme/borderline</span>
          <span className="font-mono text-sm text-[#A1A1A1] font-normal tracking-[-0.05em]">b333cdb</span>
        </div>
        <div className="flex item-center justify-center bg-[#107A4D] py-1 px-1 rounded-sm">
          <span className="font-sans tracking-[-0.05em] text-sm font-normal">Passed</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex w-full h-100 gap-x-1 px-1 py-1 justify-between rounded-lg border-[#2A2A2A] bg-[#1A1A1A] overflow-hidden">
          <div className="flex flex-col gap-y-1 px-1 pb-1 w-[60%] bg-[#0A0A0A] rounded-0 rounded-tl-sm rounded-bl-sm overflow-hidden overflow-y-scroll">
            <div className="w-full h-fit items-center justify-start">
              <span className="font-sans text-sm font-normal tracking-[-0.05em]">Routes</span>
            </div>
            <div className="flex flex-col overflow-y-scroll flex-1">
              <RouteView />
            </div>
          </div>
          <div className="flex px-1 pt-1 pb-1 flex-1 bg-[#0A0A0A] rounded-0 rounded-tr-sm rounded-br-sm">
            <LocalePanel
              selectedLocale={selectedLocale}
              onLocaleSelect={setSelectedLocale}
            />
          </div>
        </div>
        <div className="flex w-full h-70 border border-[#2A2A2A] rounded-lg bg-[#1A1A1A] overflow-hidden">
          <MissingKeysTable />
        </div>
      </div>
    </div>
  )
}