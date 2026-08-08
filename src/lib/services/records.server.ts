import type { Prescription, Report } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_PRESCRIPTIONS, DEMO_REPORTS } from "@/lib/demo-data";

// ============================================================================
// Server-only read helpers for digital health records.
// Import from Server Components / Server Actions only.
// ============================================================================

/** Fetch the patient's digital health records. */
export async function getReports(patientId: string, category?: string, search?: string): Promise<Report[]> {
  if (!isSupabaseConfigured()) {
    return filterDemoReports(category, search);
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("reports").select("*").eq("patient_id", patientId);
    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Report[];
  } catch {
    return [];
  }
}

/** Fetch prescriptions. */
export async function getPrescriptions(patientId: string): Promise<Prescription[]> {
  if (!isSupabaseConfigured()) return DEMO_PRESCRIPTIONS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*, doctor:doctors(*)")
      .eq("patient_id", patientId)
      .order("prescribed_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Prescription[];
  } catch {
    return [];
  }
}

function filterDemoReports(category?: string, search?: string): Report[] {
  let result = [...DEMO_REPORTS];
  if (category) result = result.filter((r) => r.category === category);
  if (search) result = result.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  return result;
}
