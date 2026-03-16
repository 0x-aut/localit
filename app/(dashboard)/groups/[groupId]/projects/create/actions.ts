"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type CreateProjectInput = {
  groupId: string;
  name: string;
  slug: string;
  repoUrl: string;
  repoName: string;
};

export async function createProject({
  groupId,
  name,
  slug,
  repoUrl,
  repoName,
}: CreateProjectInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      group_id: groupId,
      name,
      slug,
      repo_url: repoUrl,
      repo_name: repoName,
    })
    .select("slug")
    .single();

  if (error) {
    if (error.message.includes("unique")) {
      return { error: "That slug is already taken — try a different one" };
    }
    return { error: error.message };
  }

  redirect(`/groups/${groupId}/projects/${project.slug}`);
}