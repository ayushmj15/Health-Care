import type { Medicine, Reminder } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_MEDICINES, DEMO_REMINDERS } from "@/lib/demo-data";

// ============================================================================
// Server-only read helpers for medicines & reminders.
// Import from Server Components / Server Actions only.
// ============================================================================

/** Fetch active medicines for a patient. */
export async function getMedicines(patientId: string): Promise<Medicine[]> {
  if (!isSupabaseConfigured()) return DEMO_MEDICINES;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Medicine[];
  } catch {
    return DEMO_MEDICINES;
  }
}

/** Fetch reminder history for a patient. */
export async function getReminders(patientId: string): Promise<Reminder[]> {
  if (!isSupabaseConfigured()) return DEMO_REMINDERS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reminders")
      .select("*, medicine:medicines(*)")
      .eq("patient_id", patientId)
      .order("scheduled_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return (data ?? []) as Reminder[];
  } catch {
    return DEMO_REMINDERS;
  }
}
