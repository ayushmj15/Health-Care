"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Sign the current user out. Works in demo mode too. */
export async function signOut() {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore — fall through to redirect
    }
  }
  redirect("/");
}
