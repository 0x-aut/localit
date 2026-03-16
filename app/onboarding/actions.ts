"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createGroup(name: string, slug: string, invites: string[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: group, error } = await supabase
    .from("groups")
    .insert({ name, slug, owner_id: user.id })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("unique")) {
      return { error: "That slug is already taken — try a different one" };
    }
    return { error: error.message };
  }

  if (invites.length > 0) {
    await supabase.from("group_invites").insert(
      invites.map((email) => ({
        group_id: group.id,
        invited_email: email,
        invited_by: user.id,
      }))
    );
  }

  redirect(`/groups/${group.id}/dashboard`);
}