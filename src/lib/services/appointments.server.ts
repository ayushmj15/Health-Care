import type { Appointment } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_APPOINTMENTS } from "@/lib/demo-data";

// ============================================================================
// Server-only read helpers for appointments.
// Import from Server Components / Server Actions only — this module must never
// be bundled into a client component (it uses the server Supabase client).
// ============================================================================

/** Get appointments for a patient, newest first. */
export async function getAppointments(patientId: string, status?: string): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) {
    return filterDemo(status);
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase
      .from("appointments")
      .select("*, doctor:doctors(*), hospital:hospitals(*)")
      .eq("patient_id", patientId);

    if (status) query = query.eq("status", status);

    const { data, error } = await query.order("appointment_date", { ascending: false }).limit(50);
    if (error) throw error;
    return (data ?? []) as Appointment[];
  } catch {
    return [];
  }
}

/** Upcoming (future) confirmed/pending appointments. */
export async function getUpcomingAppointments(patientId: string): Promise<Appointment[]> {
  const all = await getAppointments(patientId);
  const today = new Date().toISOString().split("T")[0];
  return all
    .filter((a) => a.appointment_date >= today && (a.status === "confirmed" || a.status === "pending"))
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
}

function filterDemo(status?: string): Appointment[] {
  let result = [...DEMO_APPOINTMENTS];
  if (status) result = result.filter((a) => a.status === status);
  return result.sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
}
