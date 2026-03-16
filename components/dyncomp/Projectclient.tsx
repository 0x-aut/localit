"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FolderGit2, Plus, ChevronRight, GitBranch } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Project = {
  id: string;
  name: string;
  slug: string;
  repo_name: string;
  repo_url: string;
  created_at: string;
  run_count: number;
  last_run_status: string | null;
};

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-3 py-24">
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A]">
        <FolderGit2 size={18} color="#555555" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
          No projects yet
        </span>
        <span className="font-sans text-xs font-light tracking-[-0.05em] text-[#555555]">
          Connect a GitHub repo to start auditing locales
        </span>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-sm bg-[#107A4D] hover:bg-[#0D6B42] text-white font-sans text-xs tracking-[-0.05em] transition-colors duration-150 cursor-pointer"
      >
        <Plus size={12} />
        Create your first project
      </button>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-3 border-b border-[#2A2A2A] hover:bg-[#111111] transition-colors duration-150 cursor-pointer"
    >
      <div className="flex items-center gap-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] shrink-0">
          <GitBranch size={14} color="#555555" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="font-sans text-sm font-normal tracking-[-0.05em] text-[#EDEDED]">
            {project.name}
          </span>
          <span className="font-mono text-xs tracking-[-0.05em] text-[#555555]">
            {project.repo_name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-6">
        <div className="flex flex-col items-end gap-y-0.5">
          <div className="flex items-center gap-x-1.5">
            <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
              Last run
            </span>
            {project.last_run_status === null ? (
              <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
                none
              </span>
            ) : (
              <span
                className={`font-sans text-xs tracking-[-0.05em] ${
                  project.last_run_status === "passed"
                    ? "text-[#22C55E]"
                    : "text-[#EF4444]"
                }`}
              >
                {project.last_run_status}
              </span>
            )}
          </div>
          <span className="font-sans text-xs tracking-[-0.05em] text-[#555555]">
            {project.run_count} run{project.run_count !== 1 ? "s" : ""} ·{" "}
            {formatDistanceToNow(new Date(project.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
        <ChevronRight size={14} color="#555555" />
      </div>
    </div>
  );
}

export function ProjectsClient({ groupId }: { groupId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, slug, repo_name, repo_url, created_at")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Get run counts + last run status per project
      const projectIds = data.map((p) => p.id);

      const { data: runs } = await supabase
        .from("audit_runs")
        .select("project_id, status, run_at")
        .in("project_id", projectIds)
        .order("run_at", { ascending: false });

      const mapped: Project[] = data.map((p) => {
        const projectRuns = runs?.filter((r) => r.project_id === p.id) ?? [];
        return {
          ...p,
          run_count: projectRuns.length,
          last_run_status: projectRuns[0]?.status ?? null,
        };
      });

      setProjects(mapped);
      setLoading(false);
    }

    fetchProjects();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full px-4 py-4 gap-y-4">
        <div className="flex justify-between items-center">
          <div className="w-16 h-4 bg-[#1A1A1A] rounded-sm animate-pulse" />
          <div className="w-24 h-7 bg-[#1A1A1A] rounded-sm animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-full h-14 bg-[#111111] rounded-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full px-4 py-4 gap-y-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-base font-normal tracking-[-0.05em] text-[#EDEDED]">
          Projects
        </span>
        {projects.length > 0 && (
          <button
            onClick={() =>
              router.push(`/groups/${groupId}/projects/create`)
            }
            className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-sm bg-[#107A4D] hover:bg-[#0D6B42] text-white font-sans text-xs tracking-[-0.05em] transition-colors duration-150 cursor-pointer"
          >
            <Plus size={12} />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          onCreateClick={() =>
            router.push(`/groups/${groupId}/projects/create`)
          }
        />
      ) : (
        <div className="flex flex-col border border-b-0 border-l-0 border-r-0 border-[#2A2A2A] rounded-0 overflow-hidden">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                router.push(
                  `/groups/${groupId}/projects/${project.slug}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}