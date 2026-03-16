"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  VectorSquare, Activity,
  Bug, PackageCheck, LayersPlus
} from "lucide-react";
import { RepoHealthCard } from "@/components/dyncomp/Repo";

type RunStats = {
  total: number;
  active: number;
  passed: number;
  failed: number;
};

type LocaleHealth = {
  country: string;
  code: string;
  flag: string;
  coverage: number;
};

type RunHealth = {
  id: string;
  commitSha: string;
  lastRunStatus: "passed" | "failed" | null;
  sparklineData: number[];
  locales: LocaleHealth[];
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
  en: { country: "English", flag: "US" },
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-x-2 items-center min-w-[50%] w-[50%] max-w-[50%]">
      <div className="px-4 py-4 border border-[#2A2A2A] rounded-sm hover:bg-[#1A1A1A]">
        <Icon size={18} color="#EDEDED" />
      </div>
      <div className="flex flex-col gap-y-0.5 justify-start">
        <span className="font-sans tracking-[-0.05em] font-light text-xs text-[#A1A1A1]">
          {label}
        </span>
        <span className="font-sans tracking-[-0.05em] font-normal text-sm text-[#EDEDED]">
          {value}
        </span>
      </div>
    </div>
  );
}

function EmptyHealthCard() {
  return (
    <div className="flex flex-col h-38.75 gap-y-2 px-1 py-1 border rounded-sm bg-[#1A1A1A] border-[#2A2A2A] items-center justify-center">
      <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
        No runs yet
      </span>
      <span className="font-sans text-xs tracking-[-0.05em] text-[#555555] font-light">
        Create a run to see locale health
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const groupId = params.groupId as string;
  const projectSlug = params.projectSlug as string;

  const [project, setProject] = useState<{ id: string; name: string; repo_url: string; repo_name: string } | null>(null);
  const [stats, setStats] = useState<RunStats>({ total: 0, active: 0, passed: 0, failed: 0 });
  const [runHealthCards, setRunHealthCards] = useState<RunHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch project
      const { data: projectData } = await supabase
        .from("projects")
        .select("id, name, repo_url, repo_name")
        .eq("group_id", groupId)
        .eq("slug", projectSlug)
        .single();

      if (!projectData) {
        setLoading(false);
        return;
      }

      setProject(projectData);

      // Fetch runs for this project
      const { data: runs } = await supabase
        .from("audit_runs")
        .select("id, status, commit_sha, run_at")
        .eq("project_id", projectData.id)
        .order("run_at", { ascending: false });

      if (!runs || runs.length === 0) {
        setLoading(false);
        return;
      }

      // Stats
      setStats({
        total: runs.length,
        active: runs.filter((r) => r.status === "running" || r.status === "pending").length,
        passed: runs.filter((r) => r.status === "passed").length,
        failed: runs.filter((r) => r.status === "failed").length,
      });

      // Fetch locale results for the last 4 runs
      const recentRuns = runs.slice(0, 4);
      const runIds = recentRuns.map((r) => r.id);

      const { data: localeResults } = await supabase
        .from("locale_results")
        .select("run_id, locale, coverage_pct, passed")
        .in("run_id", runIds);

      // Sparkline — coverage trend per locale across all runs (most recent last)
      const allRunIds = runs.map((r) => r.id);
      const { data: allLocaleResults } = await supabase
        .from("locale_results")
        .select("run_id, locale, coverage_pct")
        .in("run_id", allRunIds);

      // Build health cards — one per recent run
      const cards: RunHealth[] = recentRuns.map((run) => {
        const runLocales = (localeResults ?? [])
          .filter((lr) => lr.run_id === run.id)
          .map((lr) => ({
            country: LOCALE_META[lr.locale]?.country ?? lr.locale,
            code: lr.locale.toUpperCase(),
            flag: LOCALE_META[lr.locale]?.flag ?? lr.locale.toUpperCase(),
            coverage: Math.round(lr.coverage_pct ?? 0),
          }));

        // Sparkline — coverage trend for this run's primary locale
        const primaryLocale = runLocales[0]?.code?.toLowerCase();
        const sparkline = (allLocaleResults ?? [])
          .filter((lr) => lr.locale === primaryLocale)
          .slice(-10)
          .map((lr) => Math.round(lr.coverage_pct ?? 0));

        return {
          id: run.id,
          commitSha: run.commit_sha.slice(0, 7),
          lastRunStatus: run.status === "passed" || run.status === "failed"
            ? run.status
            : null,
          sparklineData: sparkline,
          locales: runLocales.slice(0, 4),
        };
      });

      setRunHealthCards(cards);
      setLoading(false);
    }

    fetchData();
  }, [groupId, projectSlug]);

  const hasRuns = runHealthCards.length > 0;

  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden p-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-10">
        <span className="font-sans tracking-[-0.05em] text-sm font-normal">
          {loading ? "Dashboard" : project?.name ?? "Dashboard"}
        </span>
        <Button
          size="xs"
          className="bg-[#107A4D] rounded-xs border-[#2A2A2A] cursor-pointer hover:bg-[#0D6B42]"
          onClick={() =>
            router.push(`/groups/${groupId}/projects/${projectSlug}/runs/create`)
          }
        >
          <LayersPlus />
          <span className="font-sans tracking-[-0.05em] text-xs font-normal">
            Create a run
          </span>
        </Button>
      </div>

      <div className="flex gap-x-4 h-[70%] px-10 py-7.5">
        {/* Stats */}
        <div className="flex flex-col gap-y-4 w-[50%] items-start justify-center">
          <div className="flex">
            <span className="font-sans tracking-[-0.05em] font-normal text-lg">
              Project
            </span>
          </div>
          <div className="flex gap-x-10 w-full items-center">
            <StatCard
              icon={VectorSquare}
              label="Total runs"
              value={`${stats.total} run${stats.total !== 1 ? "s" : ""}`}
            />
            <StatCard
              icon={Activity}
              label="Active runs"
              value={`${stats.active} run${stats.active !== 1 ? "s" : ""}`}
            />
          </div>
          <div className="flex gap-x-10 w-full items-center">
            <StatCard
              icon={PackageCheck}
              label="Runs passed"
              value={`${stats.passed} run${stats.passed !== 1 ? "s" : ""}`}
            />
            <StatCard
              icon={Bug}
              label="Runs failed"
              value={`${stats.failed} run${stats.failed !== 1 ? "s" : ""}`}
            />
          </div>
        </div>

        {/* Health cards */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-38.75 bg-[#111111] rounded-sm border border-[#2A2A2A] animate-pulse"
              />
            ))
          ) : hasRuns ? (
            runHealthCards.map((card) => (
              <RepoHealthCard
                key={card.id}
                id={card.id}
                name={card.commitSha}
                githubUrl={project?.repo_url ?? ""}
                connectedAt=""
                totalRuns={stats.total}
                lastRunStatus={card.lastRunStatus}
                sparklineData={card.sparklineData}
                locales={card.locales}
              />
            ))
          ) : (
            <>
              {[...Array(4)].map((_, i) => (
                <EmptyHealthCard key={i} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}