"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RepoRun } from "@/components/dyncomp/Repo";
import {
  LayersPlus, ArrowDownAZ,
  ArrowDown01, ArrowDownNarrowWide,
  VectorSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Run = {
  id: string;
  commitSha: string;
  status: "passed" | "failed" | "pending" | "running";
  runAt: string;
  totalLocales: number;
  totalErrors: number;
};

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-3 py-24">
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A]">
        <VectorSquare size={18} color="#555555" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
          No runs yet
        </span>
        <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
          Create your first run to start auditing locales
        </span>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-xs bg-[#107A4D] hover:bg-[#0D6B42] text-white font-sans text-xs tracking-[-0.05em] transition-colors duration-150 cursor-pointer"
      >
        <LayersPlus size={12} />
        Create your first run
      </button>
    </div>
  );
}

export default function RunsPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const groupId = params.groupId as string;
  const projectSlug = params.projectSlug as string;

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [projectRepoUrl, setProjectRepoUrl] = useState<string>("");
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Get project
      const { data: project } = await supabase
        .from("projects")
        .select("id, name, repo_url, repo_name")
        .eq("group_id", groupId)
        .eq("slug", projectSlug)
        .single();

      if (!project) {
        setLoading(false);
        return;
      }

      setProjectId(project.id);
      setProjectName(project.repo_name);
      setProjectRepoUrl(project.repo_url);

      // Get runs
      const { data: runsData } = await supabase
        .from("audit_runs")
        .select("id, commit_sha, status, run_at")
        .eq("project_id", project.id)
        .order("run_at", { ascending: false });

      if (!runsData || runsData.length === 0) {
        setLoading(false);
        return;
      }

      // Get locale results for error + locale counts
      const runIds = runsData.map((r) => r.id);
      const { data: localeResults } = await supabase
        .from("locale_results")
        .select("run_id, locale, visual_issues, missing_keys")
        .in("run_id", runIds);

      const mapped: Run[] = runsData.map((run) => {
        const runLocales = (localeResults ?? []).filter(
          (lr) => lr.run_id === run.id
        );
        const totalErrors = runLocales.reduce(
          (acc, lr) => acc + (lr.visual_issues ?? 0) + (lr.missing_keys ?? 0),
          0
        );

        return {
          id: run.id,
          commitSha: run.commit_sha.slice(0, 7),
          status: run.status,
          runAt: formatDistanceToNow(new Date(run.run_at), { addSuffix: true }),
          totalLocales: runLocales.length,
          totalErrors,
        };
      });

      setRuns(mapped);
      setLoading(false);
    }

    fetchData();
  }, [groupId, projectSlug]);

  const filtered = statusFilter
    ? runs.filter((r) => r.status === statusFilter)
    : runs;

  const createRunPath = `/groups/${groupId}/projects/${projectSlug}/runs/create`;

  return (
    <div className="flex flex-col gap-y-4 w-full h-full overflow-hidden p-2">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <span className="font-sans tracking-[-0.05em] text-sm font-normal cursor-pointer">
          Runs
        </span>
        <div className="flex gap-x-1 items-center">
          <Button
            size="xs"
            variant="outline"
            className={`bg-transparent rounded-xs border-[#2A2A2A] ${
              statusFilter === "passed" ? "border-[#22C55E] text-[#22C55E]" :
              statusFilter === "failed" ? "border-[#EF4444] text-[#EF4444]" : ""
            }`}
            onClick={() => setStatusFilter(
              statusFilter === null ? "passed" :
              statusFilter === "passed" ? "failed" : null
            )}
          >
            <ArrowDown01 size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">
              {statusFilter ? `Status: ${statusFilter}` : "Filter by status"}
            </span>
          </Button>
          <Button
            size="xs"
            className="bg-[#107A4D] hover:bg-[#0D6B42] rounded-xs cursor-pointer"
            onClick={() => router.push(createRunPath)}
          >
            <LayersPlus size={12} />
            <span className="font-sans tracking-[-0.05em] text-xs font-normal">
              Create run
            </span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-y-0 border-t border-[#2A2A2A] h-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full h-12 border-b border-[#2A2A2A] animate-pulse bg-[#111111]"
            />
          ))}
        </div>
      ) : runs.length === 0 ? (
        <EmptyState onCreateClick={() => router.push(createRunPath)} />
      ) : (
        <div className="flex flex-col gap-y-0 overflow-y-scroll border border-l-0 border-b-0 border-r-0 border-t-[#2A2A2A] h-full">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                No runs match the current filter
              </span>
            </div>
          ) : (
            filtered.map((run) => (
              <RepoRun
                key={run.id}
                id={run.id}
                name={projectName}
                commitSHA={run.commitSha}
                githubUrl={projectRepoUrl}
                totalLocales={run.totalLocales}
                totalErrors={run.totalErrors}
                runStatus={
                  run.status === "passed" || run.status === "failed"
                    ? run.status
                    : null
                }
                runTimeStamp={run.runAt}
                runId={run.id}
                groupId={groupId}
                projectSlug={projectSlug}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}