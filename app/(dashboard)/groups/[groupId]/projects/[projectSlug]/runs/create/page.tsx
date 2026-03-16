"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, Globe, GitBranch, Route, Settings2 } from "lucide-react";
import { createRun } from "./actions";
import { createClient } from "@/lib/supabase/client";

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

type LocaleStrategy = "prefix" | "cookie" | "query" | "subdomain";

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
  disabled,
}: {
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full bg-[#111111] border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] tracking-[-0.05em] placeholder:text-[#555555] outline-none focus:border-[#3A3A3A] transition-colors duration-150 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
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
  const params = useParams();
  const supabase = createClient();

  const groupId = params.groupId as string;
  const projectSlug = params.projectSlug as string;

  // Project data — pre-filled from Supabase
  const [projectRepoUrl, setProjectRepoUrl] = useState("");
  const [projectRepoName, setProjectRepoName] = useState("");
  const [projectLoading, setProjectLoading] = useState(true);

  // ── Step 1: Repo details ──────────────────────────────────────────────────
  const [branch, setBranch] = useState("main");
  const [targetUrl, setTargetUrl] = useState("");
  const [localeStrategy, setLocaleStrategy] = useState<LocaleStrategy>("prefix");

  // ── Step 2: Locale config ─────────────────────────────────────────────────
  const [sourceLocale, setSourceLocale] = useState("en");
  const [targetLocales, setTargetLocales] = useState<string[]>(["de", "fr"]);
  const [coverageThreshold, setCoverageThreshold] = useState("90");

  // ── Step 3: Routes ────────────────────────────────────────────────────────
  const [autoDetect, setAutoDetect] = useState(true);
  const [manualRoutes, setManualRoutes] = useState("/\n/checkout\n/dashboard");

  // Error + submit state
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project to pre-fill repo info
  useEffect(() => {
    async function fetchProject() {
      const { data } = await supabase
        .from("projects")
        .select("repo_url, repo_name, branch, source_locale, target_locales, routes, auto_detect_routes, coverage_threshold, locale_strategy")
        .eq("group_id", groupId)
        .eq("slug", projectSlug)
        .single();

      if (data) {
        setProjectRepoUrl(data.repo_url)
        setProjectRepoName(data.repo_name)
        setBranch(data.branch ?? "main")
        setSourceLocale(data.source_locale ?? "en")
        setTargetLocales(data.target_locales ?? ["de", "fr"])
        setCoverageThreshold(String(data.coverage_threshold ?? 90))
        setAutoDetect(data.auto_detect_routes ?? true)
        if (data.routes?.length > 0) {
          setManualRoutes(data.routes.join("\n"))
        }
        if (data.locale_strategy) {
          setLocaleStrategy(data.locale_strategy)
        }
      }

      setProjectLoading(false)
    }

    fetchProject()
  }, [groupId, projectSlug])

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
    projectRepoUrl !== "" &&
    targetLocales.length > 0 &&
    (autoDetect || routes.length > 0);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await createRun({
      groupId,
      projectSlug,
      repoUrl: projectRepoUrl,
      branch: branch.trim(),
      targetUrl: targetUrl.trim(),
      sourceLocale,
      targetLocales,
      coverageThreshold: parseInt(coverageThreshold),
      autoDetect,
      routes,
      localeStrategy,
    });

    if (result?.error) {
      setSubmitError(result.error);
      setIsSubmitting(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-4 h-4 rounded-full border border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center overflow-y-auto px-4 py-4 gap-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between w-[672px]">
        <div className="flex flex-col gap-y-0.5 justify-start">
          <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
            New Run
          </span>
          <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
            Configure locale settings and start an audit for{" "}
            <span className="font-mono text-[#A1A1A1]">{projectRepoName}</span>
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

      <div className="flex flex-col gap-y-6 max-w-2xl w-full">

        {/* ── Section 1: Repo details ─────────────────────────────────────── */}
        <div className="flex flex-col gap-y-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#111111]">
          <SectionHeader
            icon={GitBranch}
            title="Repository"
            description="Repository is locked to the project — configure branch and target URL"
          />
          <div className="flex flex-col gap-y-3">
            {/* Repo display — read only */}
            <div className="flex flex-col gap-y-1.5">
              <Label>Repository</Label>
              <div className="flex items-center gap-x-2 px-2.5 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm">
                <GitBranch size={12} color="#555555" strokeWidth={1.5} />
                <span className="font-mono text-xs text-[#A1A1A1] tracking-[-0.05em]">
                  {projectRepoName}
                </span>
                <Link
                  href={projectRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto"
                >
                  <Image
                    src="/githubsymbol.png"
                    alt="GitHub"
                    width={12}
                    height={12}
                  />
                </Link>
              </div>
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

            {targetUrl === "" ? (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                No target URL — Localit will clone and build your app locally
              </span>
            ) : (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#22C55E]">
                ✓ Localit will screenshot your deployed app directly
              </span>
            )}

            {/* Locale strategy */}
            <div className="flex flex-col gap-y-1.5">
              <Label>Locale routing strategy</Label>
              <div className="flex gap-x-2 flex-wrap">
                {(["prefix", "cookie", "query", "subdomain"] as LocaleStrategy[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setLocaleStrategy(s)}
                    className={`px-2 py-1 rounded-sm border text-xs font-mono tracking-[-0.05em] transition-all duration-150 cursor-pointer ${
                      localeStrategy === s
                        ? "bg-[#107A4D]/15 border-[#107A4D]/40 text-[#22C55E]"
                        : "bg-[#0A0A0A] border-[#2A2A2A] text-[#A1A1A1] hover:border-[#3A3A3A]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                {localeStrategy === "prefix" && "e.g. /de/checkout — most common with next-intl and Lingo.dev"}
                {localeStrategy === "cookie" && "NEXT_LOCALE cookie — no URL change between locales"}
                {localeStrategy === "query" && "e.g. /checkout?locale=de"}
                {localeStrategy === "subdomain" && "e.g. de.yourapp.com"}
              </span>
            </div>
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

            <div className="flex flex-col gap-y-1.5">
              <Label>
                Target locales{" "}
                <span className="text-[#555555]">({targetLocales.length} selected)</span>
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
                    autoDetect ? "left-4 bg-[#22C55E]" : "left-0.5 bg-[#555555]"
                  }`}
                />
              </div>
              <span className="font-sans text-xs tracking-[-0.05em] text-[#A1A1A1]">
                Auto-detect routes from sitemap
              </span>
            </button>

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
              { label: "Repository", value: projectRepoName },
              { label: "Branch", value: branch },
              { label: "Target URL", value: targetUrl || "Build locally" },
              { label: "Locale strategy", value: localeStrategy },
              { label: "Source locale", value: sourceLocale },
              { label: "Target locales", value: targetLocales.length > 0 ? targetLocales.join(", ") : "None selected" },
              { label: "Coverage threshold", value: `${coverageThreshold}%` },
              { label: "Routes", value: autoDetect ? "Auto-detect" : `${routes.length} manual route${routes.length !== 1 ? "s" : ""}` },
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

          {!isValid && (
            <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
              {targetLocales.length === 0
                ? "Select at least one target locale"
                : "Add at least one route or enable auto-detect"}
            </span>
          )}

          {submitError && (
            <span className="font-sans text-xs tracking-[-0.05em] text-[#EF4444]">
              {submitError}
            </span>
          )}

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