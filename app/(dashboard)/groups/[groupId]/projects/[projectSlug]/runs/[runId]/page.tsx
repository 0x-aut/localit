"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RouteView } from "@/components/dyncomp/Routelist";
import { LocalePanel } from "@/components/dyncomp/Localecard";
import { MissingKeysTable } from "@/components/dyncomp/Missingkeys";
import { Badge } from "@/components/ui/badge";

type RunDetail = {
  id: string;
  repo: string;
  commit_sha: string;
  status: "pending" | "running" | "passed" | "failed";
  coverage_threshold: number;
};

type LocaleResult = {
  locale: string;
  coverage_pct: number;
  missing_keys: number;
  missing_key_names: string[];
  visual_issues: number;
  issue_details: any[];
  passed: boolean;
};

type Screenshot = {
  id: string;
  locale: string;
  route: string;
  baseline_url: string | null;
  current_url: string | null;
  diff_url: string | null;
  has_regression: boolean;
  diff_pct: number | null;
};

type MissingKey = {
  locale: string;
  localeCountry: string;
  localeFlag: string;
  keyName: string;
  affectedRoutes: string[];
  status: "missing" | "outdated";
};

const LOCALE_META: Record<string, { country: string; flag: string }> = {
  de: { country: "Germany", flag: "DE" },
  fr: { country: "France", flag: "FR" },
  ja: { country: "Japan", flag: "JP" },
  es: { country: "Spain", flag: "ES" },
  pt: { country: "Portugal", flag: "PT" },
  it: { country: "Italy", flag: "IT" },
  nl: { country: "Netherlands", flag: "NL" },
  ko: { country: "South Korea", flag: "KR" },
  zh: { country: "China", flag: "CN" },
  ru: { country: "Russia", flag: "RU" },
  ar: { country: "Saudi Arabia", flag: "SA" },
  pl: { country: "Poland", flag: "PL" },
  tr: { country: "Turkey", flag: "TR" },
  sv: { country: "Sweden", flag: "SE" },
  da: { country: "Denmark", flag: "DK" },
  en: { country: "English", flag: "US" },
};

function RunBadge({ status }: { status: RunDetail["status"] }) {
  if (status === "pending" || status === "running") {
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-x-1.5 border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10 font-sans tracking-[-0.05em] text-xs font-normal"
      >
        <div className="w-2.5 h-2.5 rounded-full border border-[#F59E0B]/30 border-t-[#F59E0B] animate-spin" />
        {status === "pending" ? "Pending" : "Running"}
      </Badge>
    );
  }

  if (status === "passed") {
    return (
      <Badge
        variant="outline"
        className="border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10 font-sans tracking-[-0.05em] text-xs font-normal"
      >
        Passed
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10 font-sans tracking-[-0.05em] text-xs font-normal"
    >
      Failed
    </Badge>
  );
}

export default function RunIdPage() {
  const params = useParams();
  const runId = params.runId as string;
  const supabase = createClient();

  const [selectedLocale, setSelectedLocale] = useState<string>("");
  const [run, setRun] = useState<RunDetail | null>(null);
  const [localeResults, setLocaleResults] = useState<LocaleResult[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRunData() {
    const { data: runData } = await supabase
      .from("audit_runs")
      .select("id, repo, commit_sha, status, coverage_threshold")
      .eq("id", runId)
      .single();

    if (!runData) { setLoading(false); return; }
    setRun(runData);

    const { data: locales } = await supabase
      .from("locale_results")
      .select("locale, coverage_pct, missing_keys, missing_key_names, visual_issues, issue_details, passed")
      .eq("run_id", runId);

    setLocaleResults(locales ?? []);

    const firstFailing = locales?.find((l) => !l.passed)?.locale
      ?? locales?.[0]?.locale
      ?? "";
    setSelectedLocale(firstFailing);

    const { data: shots } = await supabase
      .from("screenshots")
      .select("id, locale, route, baseline_url, current_url, diff_url, has_regression, diff_pct")
      .eq("run_id", runId);

    setScreenshots(shots ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRunData();

    const channel = supabase
      .channel(`run-${runId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "audit_runs",
          filter: `id=eq.${runId}`,
        },
        (payload) => {
          setRun((prev) =>
            prev ? { ...prev, status: payload.new.status } : prev
          );
          if (
            payload.new.status === "passed" ||
            payload.new.status === "failed"
          ) {
            fetchRunData();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [runId]);

  // Build RouteView data
  const routes = [...new Set(screenshots.map((s) => s.route))];
  const routeViewData = routes.map((route) => {
    const routeShots = screenshots.filter((s) => s.route === route);
    const baselineShot = routeShots.find((s) => s.baseline_url); // We will pick any shot and use the baselineshot from there
    const currentShot = routeShots.find((s) => s.locale === selectedLocale);
    const hasIssues = routeShots.some((s) => s.has_regression);
    const diffPct = currentShot?.diff_pct ?? 0;

    const issues = localeResults
      .filter((lr) => lr.locale === selectedLocale)
      .flatMap((lr) =>
        (lr.issue_details ?? [])
          .filter((d: any) => d.route === route)
          .map((d: any) => ({
            type: d.type as "overflow" | "pixel_diff" | "missing_screenshot",
            description: d.description,
            diffPct: d.diffPct ?? undefined,
            aiAnalysis: d.aiAnalysis ?? null,
          }))
      );

    return {
      route,
      hasIssues,
      diffPct,
      screenshots: {
        baseline: baselineShot?.baseline_url ?? "",
        current: currentShot?.current_url ?? "",
        diff: currentShot?.diff_url ?? "",
      },
      issues,
    };
  });

  // Build LocalePanel data
  const localePanelData = localeResults.map((lr) => ({
    code: lr.locale,
    country: LOCALE_META[lr.locale]?.country ?? lr.locale,
    flag: LOCALE_META[lr.locale]?.flag ?? lr.locale.toUpperCase(),
    coveragePct: Math.round(lr.coverage_pct ?? 0),
    missingKeys: lr.missing_keys,
    visualIssues: lr.visual_issues,
    passed: lr.passed,
    sparklineData: [],
  }));

  // Build MissingKeysTable data
  const missingKeysData: MissingKey[] = localeResults.flatMap((lr) =>
    (lr.missing_key_names ?? []).map((keyName: string) => ({
      locale: lr.locale,
      localeCountry: LOCALE_META[lr.locale]?.country ?? lr.locale,
      localeFlag: LOCALE_META[lr.locale]?.flag ?? lr.locale.toUpperCase(),
      keyName,
      affectedRoutes: routes,
      status: "missing" as const,
    }))
  );

  const isLive = run?.status === "pending" || run?.status === "running";

  if (loading) {
    return (
      <div className="flex flex-col gap-y-4 w-full h-full p-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-x-2 items-center">
            <div className="w-32 h-4 bg-[#1A1A1A] rounded-sm animate-pulse" />
            <div className="w-16 h-4 bg-[#1A1A1A] rounded-sm animate-pulse" />
          </div>
          <div className="w-16 h-6 bg-[#1A1A1A] rounded-sm animate-pulse" />
        </div>
        <div className="w-full h-100 bg-[#1A1A1A] rounded-lg animate-pulse" />
        <div className="w-full h-70 bg-[#1A1A1A] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!run) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="font-sans text-sm tracking-[-0.05em] text-[#555555]">
          Run not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden overflow-y-scroll p-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-x-2 items-center">
          <span className="font-sans tracking-[-0.05em] text-base font-normal cursor-pointer">
            {run.repo}
          </span>
          <span className="font-mono text-sm text-[#A1A1A1] font-normal tracking-[-0.05em]">
            {run.commit_sha.slice(0, 7)}
          </span>
        </div>
        <RunBadge status={run.status} />
      </div>

      {/* Live progress */}
      {isLive && (
        <div className="flex items-center gap-x-2 px-3 py-2 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A]">
          <div className="w-3 h-3 rounded-full border border-[#F59E0B]/30 border-t-[#F59E0B] animate-spin" />
          <span className="font-sans text-xs tracking-[-0.05em] text-[#A1A1A1]">
            {run.status === "pending"
              ? "Run is queued — worker will pick this up shortly..."
              : "Run is in progress — results will appear automatically..."}
          </span>
        </div>
      )}

      {/* Results */}
      {!isLive && (
        <div className="flex flex-col gap-y-4">
          <div className="flex w-full h-100 gap-x-1 px-1 py-1 justify-between rounded-lg border-[#2A2A2A] bg-[#1A1A1A] overflow-hidden">
            <div className="flex flex-col gap-y-1 px-1 pb-1 w-[60%] bg-[#0A0A0A] rounded-tl-sm rounded-bl-sm overflow-hidden overflow-y-scroll">
              <div className="w-full h-fit items-center justify-start">
                <span className="font-sans text-sm font-normal tracking-[-0.05em]">
                  Routes
                </span>
              </div>
              <div className="flex flex-col overflow-y-scroll flex-1">
                <RouteView
                  routes={routeViewData}
                  selectedLocale={selectedLocale}
                />
              </div>
            </div>
            <div className="flex px-1 pt-1 pb-1 flex-1 bg-[#0A0A0A] rounded-tr-sm rounded-br-sm">
              <LocalePanel
                locales={localePanelData}
                selectedLocale={selectedLocale}
                onLocaleSelect={setSelectedLocale}
              />
            </div>
          </div>

          <div className="flex w-full h-70 border border-[#2A2A2A] rounded-lg bg-[#1A1A1A] overflow-hidden">
            <MissingKeysTable missingKeys={missingKeysData} />
          </div>
        </div>
      )}
    </div>
  );
}