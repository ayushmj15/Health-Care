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

/** Push an in-app notification for the current user. Demo/no-DB mode is a no-op. */
export async function notifySelf(input: { title: string; message?: string; type?: "info" | "reminder" | "appointment" | "alert" | "system"; link?: string }) {
  if (!isSupabaseConfigured()) return;
  try {
    const { pushNotification } = await import("@/lib/services/admin.server");
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await pushNotification(user.id, {
      title: input.title,
      message: input.message ?? "",
      type: input.type ?? "info",
      link: input.link ?? null,
    });
  } catch {
    // notifications are best-effort
  }
}
