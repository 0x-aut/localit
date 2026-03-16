"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  console.log("trying to sign out")
  const supabase = await createClient();
  await supabase.auth.signOut();
  console.log("Signed out")
  redirect("/");
}