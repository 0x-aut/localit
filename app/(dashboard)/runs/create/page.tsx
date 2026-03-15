"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronRight, Globe, GitBranch, Route, Settings2 } from "lucide-react";

const SUPPORTED_LOCALES = [
  { code: "de", country: "Germany", flag: "DE" },
  { code: "fr", country: "France", flag: "FR" },
  { code: "ja", country: "Japan", flag: "JP" },
  { code: "es", country: "Spain", flag: "ES" },
  { code: "pt", country: "Portugal", flag: "PT" },
  { code: "it", country: "Italy", flag: "IT" },
  { code: "nl", country: "Netherlands", flag: "NL" },
  { code: "ko", country: "South Korea", flag: "KR" },
  { code: "zh", country: "China", flag: "CN" },
  { code: "ru", country: "Russia", flag: "RU" },
  { code: "ar", country: "Saudi Arabia", flag: "SA" },
  { code: "pl", country: "Poland", flag: "PL" },
  { code: "tr", country: "Turkey", flag: "TR" },
  { code: "sv", country: "Sweden", flag: "SE" },
  { code: "da", country: "Denmark", flag: "DK" },
];

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-x-3 pb-3 border-b border-[#2A2A2A]">
      <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] shrink-0 mt-0.5">
        <Icon size={13} color="#A1A1A1" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-y-0.5">
        <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
          {title}
        </span>
        <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
          {description}
        </span>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-xs font-normal tracking-[-0.05em] text-[#A1A1A1]">
      {children}
    </span>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#111111] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150"
    />
  );
}

function LocalePill({
  code,
  country,
  selected,
  isSource,
  onClick,
}: {
  code: string;
  country: string;
  selected: boolean;
  isSource: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSource}
      className={`flex items-center gap-x-1.5 px-2 py-1 rounded-sm border text-xs font-sans tracking-[-0.05em] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? "bg-[#107A4D]/15 border-[#107A4D]/40 text-[#22C55E]"
          : "bg-[#111111] border-[#2A2A2A] text-[#A1A1A1] hover:border-[#3A3A3A] hover:text-[#EDEDED]"
      }`}
    >
      <Image
        src={`https://flagsapi.com/${SUPPORTED_LOCALES.find(l => l.code === code)?.flag}/flat/16.png`}
        alt={country}
        width={14}
        height={14}
        priority
      />
      {code}
      {isSource && (
        <span className="text-[#555555] text-xs">(source)</span>
      )}
    </button>
  );
}

export default function CreateRunPage() {
  const router = useRouter();

  // ── Step 1: Repo details ──────────────────────────────────────────────────
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [targetUrl, setTargetUrl] = useState("");

  // ── Step 2: Locale config ─────────────────────────────────────────────────
  const [sourceLocale, setSourceLocale] = useState("en");
  const [targetLocales, setTargetLocales] = useState<string[]>(["de", "fr"]);
  const [coverageThreshold, setCoverageThreshold] = useState("90");

  // ── Step 3: Routes ────────────────────────────────────────────────────────
  const [autoDetect, setAutoDetect] = useState(true);
  const [manualRoutes, setManualRoutes] = useState("/\n/checkout\n/dashboard");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTargetLocale = (code: string) => {
    if (code === sourceLocale) return;
    setTargetLocales((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const routes = manualRoutes
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  const isValid =
    repoUrl.trim() !== "" &&
    targetLocales.length > 0 &&
    (autoDetect || routes.length > 0);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    // TODO: save config to Supabase + trigger GitHub Action via workflow_dispatch
    await new Promise((r) => setTimeout(r, 1200)); // placeholder

    router.push("/runs");
  };

  return (
    <div className="flex flex-col w-full h-full items-center overflow-y-auto px-4 py-4 gap-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between w-[672px]">
        <div className="flex flex-col gap-y-0.5 justify-start">
          <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
            New Run
          </span>
          <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
            Configure your repository and locale settings to start an audit
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          className="text-[#555555] hover:text-[#EDEDED] hover:bg-[#1A1A1A]"
        >
          <X size={14} />
        </Button>
      </div>

      <div className="flex flex-col gap-y-6 max-w-2xl">

        {/* ── Section 1: Repo details ─────────────────────────────────────── */}
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          <SectionHeader
            icon={GitBranch}
            title="Repository"
            description="The GitHub repository you want to audit"
          />
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1.5">
              <Label>GitHub Repository URL</Label>
              <Input
                placeholder="https://github.com/acme/frontend"
                value={repoUrl}
                onChange={setRepoUrl}
              />
            </div>
            <div className="flex gap-x-3">
              <div className="flex flex-col gap-y-1.5 flex-1">
                <Label>Branch</Label>
                <Input
                  placeholder="main"
                  value={branch}
                  onChange={setBranch}
                />
              </div>
              <div className="flex flex-col gap-y-1.5 flex-1">
                <Label>
                  Target URL{" "}
                  <span className="text-[#555555]">(optional)</span>
                </Label>
                <Input
                  placeholder="https://my-app.vercel.app"
                  value={targetUrl}
                  onChange={setTargetUrl}
                />
              </div>
            </div>
            {targetUrl === "" && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                No target URL — Localit will build and serve your app locally in CI
              </span>
            )}
          </div>
        </div>

        {/* ── Section 2: Locale config ────────────────────────────────────── */}
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          <SectionHeader
            icon={Globe}
            title="Locales"
            description="Select which languages to audit and set your coverage threshold"
          />
          <div className="flex flex-col gap-y-3">
            {/* Source locale */}
            <div className="flex flex-col gap-y-1.5">
              <Label>Source locale</Label>
              <div className="flex flex-wrap gap-1.5">
                {["en", "fr", "de", "es"].map((code) => (
                  <button
                    key={code}
                    onClick={() => setSourceLocale(code)}
                    className={`px-2 py-1 rounded-sm border text-xs font-mono tracking-[-0.05em] transition-all duration-150 cursor-pointer ${
                      sourceLocale === code
                        ? "bg-[#107A4D]/15 border-[#107A4D]/40 text-[#22C55E]"
                        : "bg-[#0A0A0A] border-[#2A2A2A] text-[#A1A1A1] hover:border-[#3A3A3A]"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Target locales */}
            <div className="flex flex-col gap-y-1.5">
              <Label>
                Target locales{" "}
                <span className="text-[#555555]">
                  ({targetLocales.length} selected)
                </span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {SUPPORTED_LOCALES.map((locale) => (
                  <LocalePill
                    key={locale.code}
                    code={locale.code}
                    country={locale.country}
                    selected={targetLocales.includes(locale.code)}
                    isSource={locale.code === sourceLocale}
                    onClick={() => toggleTargetLocale(locale.code)}
                  />
                ))}
              </div>
            </div>

            {/* Coverage threshold */}
            <div className="flex flex-col gap-y-1.5">
              <Label>Coverage threshold (%)</Label>
              <div className="flex items-center gap-x-3">
                <div className="w-32">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={coverageThreshold}
                    onChange={setCoverageThreshold}
                  />
                </div>
                <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                  Run fails if any locale drops below this %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Routes ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          <SectionHeader
            icon={Route}
            title="Routes"
            description="Which pages should Localit screenshot and audit"
          />
          <div className="flex flex-col gap-y-3">
            {/* Auto detect toggle */}
            <button
              onClick={() => setAutoDetect(!autoDetect)}
              className="flex items-center gap-x-2.5 cursor-pointer w-fit"
            >
              <div
                className={`w-8 h-4 rounded-full border transition-all duration-200 relative ${
                  autoDetect
                    ? "bg-[#107A4D]/30 border-[#107A4D]/50"
                    : "bg-[#1A1A1A] border-[#2A2A2A]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
                    autoDetect
                      ? "left-4 bg-[#22C55E]"
                      : "left-0.5 bg-[#555555]"
                  }`}
                />
              </div>
              <span className="font-sans text-xs tracking-[-0.05em] text-[#A1A1A1]">
                Auto-detect routes from sitemap
              </span>
            </button>

            {/* Manual routes */}
            {!autoDetect && (
              <div className="flex flex-col gap-y-1.5">
                <Label>Routes (one per line)</Label>
                <textarea
                  value={manualRoutes}
                  onChange={(e) => setManualRoutes(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150 resize-none"
                  placeholder={"/\n/checkout\n/dashboard\n/pricing"}
                />
                <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                  {routes.length} route{routes.length !== 1 ? "s" : ""} configured
                </span>
              </div>
            )}

            {autoDetect && (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                Localit will fetch your sitemap.xml and audit all discovered routes automatically
              </span>
            )}
          </div>
        </div>

        {/* ── Section 4: Summary + submit ─────────────────────────────────── */}
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          <SectionHeader
            icon={Settings2}
            title="Summary"
            description="Review your configuration before starting the audit"
          />
          <div className="flex flex-col gap-y-2">
            {[
              {
                label: "Repository",
                value: repoUrl || "—",
              },
              {
                label: "Branch",
                value: branch,
              },
              {
                label: "Target URL",
                value: targetUrl || "Build locally in CI",
              },
              {
                label: "Source locale",
                value: sourceLocale,
              },
              {
                label: "Target locales",
                value:
                  targetLocales.length > 0
                    ? targetLocales.join(", ")
                    : "None selected",
              },
              {
                label: "Coverage threshold",
                value: `${coverageThreshold}%`,
              },
              {
                label: "Routes",
                value: autoDetect
                  ? "Auto-detect from sitemap"
                  : `${routes.length} manual route${routes.length !== 1 ? "s" : ""}`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-1 border-b border-[#2A2A2A] last:border-0"
              >
                <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                  {label}
                </span>
                <span className="font-mono text-xs tracking-[-0.05em] text-[#A1A1A1]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Validation message */}
          {!isValid && (
            <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
              {repoUrl.trim() === ""
                ? "Repository URL is required"
                : targetLocales.length === 0
                ? "Select at least one target locale"
                : "Add at least one route or enable auto-detect"}
            </span>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`flex items-center justify-center gap-x-2 w-full py-2 rounded-sm font-sans text-sm tracking-[-0.05em] transition-all duration-150 ${
              isValid && !isSubmitting
                ? "bg-[#107A4D] text-white cursor-pointer hover:bg-[#0D6B42]"
                : "bg-[#1A1A1A] text-[#555555] cursor-not-allowed border border-[#2A2A2A]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                Starting run...
              </>
            ) : (
              <>
                <ChevronRight size={14} />
                Start Run
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}