"use client";

import Image from "next/image";
import { CircleCheck, CircleX } from "lucide-react";
import { RunSparkline } from "./Sparkline";

type LocaleCardProps = {
  code: string;
  country: string;
  flag: string;
  coveragePct: number;
  missingKeys: number;
  visualIssues: number;
  sparklineData: number[];
  passed: boolean;
  isSelected: boolean;
  onClick: () => void;
};

type LocalePanelProps = {
  locales: Omit<LocaleCardProps, "isSelected" | "onClick">[];
  selectedLocale: string;
  onLocaleSelect: (code: string) => void;
};

const mockLocales = [
  {
      code: "de",
      country: "Germany",
      flag: "DE",
      coveragePct: 94,
      missingKeys: 3,
      visualIssues: 1,
      passed: false,
      sparklineData: [87, 90, 85, 92, 94],
    },
    {
      code: "fr",
      country: "France",
      flag: "FR",
      coveragePct: 100,
      missingKeys: 0,
      visualIssues: 0,
      passed: true,
      sparklineData: [95, 97, 98, 99, 100],
    },
    {
      code: "ja",
      country: "Japan",
      flag: "JP",
      coveragePct: 87,
      missingKeys: 8,
      visualIssues: 2,
      passed: false,
      sparklineData: [98, 94, 91, 88, 87],
    },
    {
      code: "es",
      country: "Spain",
      flag: "ES",
      coveragePct: 98,
      missingKeys: 1,
      visualIssues: 0,
      passed: true,
      sparklineData: [], // not enough data
    },
    {
      code: "pt",
      country: "Portugal",
      flag: "PT",
      coveragePct: 78,
      missingKeys: 5,
      visualIssues: 1,
      passed: false,
      sparklineData: [80, 79], // not enough data
    },
    {
      code: "it",
      country: "Italy",
      flag: "IT",
      coveragePct: 91,
      missingKeys: 0,
      visualIssues: 0,
      passed: true,
      sparklineData: [85, 87, 89, 90, 91],
    },
];

function CoverageBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-0.5 bg-[#2A2A2A] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          backgroundColor: pct >= 90 ? "#22C55E" : pct >= 70 ? "#F59E0B" : "#EF4444",
        }}
      />
    </div>
  );
}

function LocaleCard({
  code,
  country,
  flag,
  coveragePct,
  missingKeys,
  visualIssues,
  sparklineData,
  passed,
  isSelected,
  onClick,
}: LocaleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col min-h-40 justify-between gap-y-2 px-2 py-2 rounded-sm border cursor-pointer transition-all duration-150 ${
        isSelected
          ? "bg-[#1A1A1A] border-[#2A2A2A]"
          : "bg-[#111111] border-transparent hover:bg-[#1A1A1A] hover:border-[#2A2A2A]"
      }`}
    >
      {/* Top row — flag, country, pass/fail */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Image
            src={`https://flagsapi.com/${flag}/flat/16.png`}
            alt={`${country} flag`}
            width={16}
            height={16}
            priority
          />
          <div className="flex flex-col gap-y-0">
            <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#EDEDED]">
              {country}
            </span>
            <span className="font-mono text-xs font-light tracking-[-0.05em] text-[#555555]">
              {code}
            </span>
          </div>
        </div>
        {passed ? (
          <CircleCheck size={12} color="#22C55E" />
        ) : (
          <CircleX size={12} color="#EF4444" />
        )}
      </div>
      
      {/* Middle — sparkline or not enough data */}
      <div className="w-full flex items-center justify-start">
        {sparklineData.length >= 5 ? (
          <RunSparkline data={sparklineData} totalPoints={10} height={40} />
        ) : (
          <span className="font-sans text-xs tracking-[-0.05em] text-[#555555] italic">
            Not enough data
          </span>
        )}

      </div>

      <div className="flex flex-col gap-y-3">
        {/* Coverage bar */}
        <CoverageBar pct={coveragePct} />
  
        {/* Bottom row — coverage %, missing keys, visual issues */}
        <div className="flex items-center justify-between">
          <span
            className={`font-mono text-xs tracking-[-0.05em] ${
              coveragePct >= 90
                ? "text-[#22C55E]"
                : coveragePct >= 70
                ? "text-[#F59E0B]"
                : "text-[#EF4444]"
            }`}
          >
            {coveragePct}%
          </span>
          <div className="flex items-center gap-x-2">
            {missingKeys > 0 && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#F59E0B]">
                {missingKeys} missing
              </span>
            )}
            {visualIssues > 0 && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
                {visualIssues} visual
              </span>
            )}
            {missingKeys === 0 && visualIssues === 0 && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                clean
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LocalePanel({
  locales = mockLocales,
  selectedLocale,
  onLocaleSelect,
}: LocalePanelProps) {
  return (
    <div className="flex flex-col gap-y-1 h-full w-full overflow-y-auto">
      <span className="font-sans text-sm font-normal tracking-[-0.05em]">
        Locales
      </span>
      <div className="grid grid-cols-2 gap-1 overflow-y-auto flex-1">
        {locales.map((locale) => (
          <LocaleCard
            key={locale.code}
            {...locale}
            isSelected={selectedLocale === locale.code}
            onClick={() => onLocaleSelect(locale.code)}
          />
        ))}
      </div>
    </div>
  );
}