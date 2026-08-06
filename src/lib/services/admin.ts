import type { AppNotification } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

// ============================================================================
// Client-safe notification helpers.
// Called from client components — uses the browser Supabase client.
// Server-only admin helpers live in "./admin.server.ts".
// ============================================================================

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  if (!isSupabaseConfigured()) return DEMO_NOTIFICATIONS;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return (data ?? []) as AppNotification[];
  } catch {
    return DEMO_NOTIFICATIONS;
  }
}

export async function markNotificationsRead(userId: string) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}
