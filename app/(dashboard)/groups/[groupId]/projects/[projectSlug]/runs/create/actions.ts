"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type CreateRunInput = {
  groupId: string;
  projectSlug: string;
  repoUrl: string;
  branch: string;
  targetUrl: string;
  sourceLocale: string;
  targetLocales: string[];
  coverageThreshold: number;
  autoDetect: boolean;
  routes: string[];
};

export async function createRun(input: CreateRunInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get project by slug
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, repo_name")
    .eq("group_id", input.groupId)
    .eq("slug", input.projectSlug)
    .single();

  if (projectError || !project) {
    return { error: "Project not found" };
  }

  // Update project config with latest locale + route settings
  await supabase
    .from("projects")
    .update({
      repo_url: input.repoUrl,
      branch: input.branch,
      target_url: input.targetUrl || null,
      source_locale: input.sourceLocale,
      target_locales: input.targetLocales,
      routes: input.autoDetect ? [] : input.routes,
      auto_detect_routes: input.autoDetect,
      coverage_threshold: input.coverageThreshold,
    })
    .eq("id", project.id);

  // Generate a placeholder commit SHA for now
  // In production this comes from the GitHub Action
  const commitSha = crypto.randomUUID().replace(/-/g, "").slice(0, 40);

  // Create the audit run
  const { data: run, error: runError } = await supabase
    .from("audit_runs")
    .insert({
      project_id: project.id,
      user_id: user.id,
      repo: project.repo_name,
      commit_sha: commitSha,
      status: "pending",
      coverage_threshold: input.coverageThreshold,
    })
    .select("id")
    .single();

  if (runError || !run) {
    return { error: runError?.message ?? "Failed to create run" };
  }

  redirect(
    `/groups/${input.groupId}/projects/${input.projectSlug}/runs/${run.id}`
  );
}