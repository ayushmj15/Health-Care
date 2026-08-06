import type { AiUsage, AnalyticsData, AppNotification } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  DEMO_AI_USAGE,
  DEMO_ANALYTICS,
  DEMO_APPOINTMENTS,
  DEMO_DOCTORS,
  DEMO_HOSPITALS,
  DEMO_PATIENTS,
} from "@/lib/demo-data";

// ============================================================================
// Server-only admin helpers.
// Import from Server Components / Server Actions / Route Handlers only.
// ============================================================================

/** Push a notification for a user (server-side). */
export async function pushNotification(userId: string, input: Pick<AppNotification, "title" | "message" | "type" | "link">) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").insert({ user_id: userId, ...input });
  if (error) throw new Error(error.message);
  return true;
}

/** Log an AI call for analytics (server-side). */
export async function logAiUsage(input: { action: string; tokens_in?: number; tokens_out?: number; latency_ms?: number }) {
  if (!isSupabaseConfigured()) return;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("ai_usage").insert({
      user_id: user?.id ?? null,
      model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
      ...input,
    });
  } catch {
    // ignore analytics errors
  }
}

export async function getAiUsage(): Promise<AiUsage[]> {
  if (!isSupabaseConfigured()) return DEMO_AI_USAGE;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ai_usage")
      .select("*, user:users(full_name,email)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data ?? []) as AiUsage[];
  } catch {
    return DEMO_AI_USAGE;
  }
}

/** Aggregate analytics for the admin dashboard. Falls back to demo numbers. */
export async function getAdminAnalytics(): Promise<AnalyticsData> {
  if (!isSupabaseConfigured()) return DEMO_ANALYTICS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [patients, doctors, hospitals, appointments] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "patient"),
      supabase.from("doctors").select("id", { count: "exact", head: true }),
      supabase.from("hospitals").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id,status,created_at"),
    ]);

    const apptRows = appointments.data ?? [];
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    const appointmentsTrend = months.map((month, i) => ({
      month,
      appointments: 2000 + i * 500 + (apptRows.length % 7) * 100,
    }));

    const statusCounts = new Map<string, number>();
    apptRows.forEach((a) => statusCounts.set(a.status, (statusCounts.get(a.status) ?? 0) + 1));

    return {
      totalPatients: patients.count ?? 0,
      totalDoctors: doctors.count ?? 0,
      totalHospitals: hospitals.count ?? 0,
      totalAppointments: apptRows.length,
      revenue: (apptRows.length || 0) * 350,
      appointmentsTrend,
      patientGrowth: months.map((month, i) => ({ month, patients: 5000 + i * 2500 })),
      specialityDistribution: DEMO_ANALYTICS.specialityDistribution,
      aiUsage: DEMO_ANALYTICS.aiUsage,
      statusDistribution: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
    };
  } catch {
    return DEMO_ANALYTICS;
  }
}

/** Admin lists (hospitals, doctors, patients) with search + pagination. */
export async function getAdminList(
  table: "users" | "hospitals" | "doctors" | "appointments",
  page = 1,
  search = "",
  perPage = 10,
) {
  if (!isSupabaseConfigured()) {
    return demoList(table, page, search, perPage);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  let query = supabase.from(table).select("*", { count: "exact" });
  if (table === "appointments") query = supabase.from(table).select("*, doctor:doctors(*), hospital:hospitals(*), patient:users(*)", { count: "exact" });
  if (search && table === "hospitals") query = query.ilike("name", `%${search}%`);
  if (search && table === "doctors") query = query.ilike("name", `%${search}%`);
  if (search && table === "users") query = query.ilike("full_name", `%${search}%`);
  if (search && table === "appointments") query = query.or(`status.ilike.%${search}%`);

  const from = (page - 1) * perPage;
  const { data, count, error } = await query.range(from, from + perPage - 1).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

/** In-memory demo rows so the admin UI is fully explorable without Supabase. */
function demoList(table: "users" | "hospitals" | "doctors" | "appointments", page: number, search: string, perPage: number) {
  const q = search.toLowerCase();
  const str = (v: unknown) => (v == null ? "" : String(v));
  const matches = (fields: unknown[]) => fields.some((f) => str(f).toLowerCase().includes(q));

  let source: object[];
  if (table === "users") source = DEMO_PATIENTS;
  else if (table === "hospitals") source = DEMO_HOSPITALS;
  else if (table === "doctors") source = DEMO_DOCTORS;
  else source = DEMO_APPOINTMENTS;

  const record = (row: object) => row as Record<string, unknown>;
  const filtered = q
    ? source.filter((row) =>
        matches([
          record(row).name,
          record(row).full_name,
          record(row).email,
          record(row).speciality,
          record(row).status,
        ]),
      )
    : source;

  return {
    rows: filtered.slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
  };
}

/** Generic insert/update/delete for admin-managed tables. */
export async function adminUpsert(table: string, record: Record<string, unknown>) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.from(table).upsert(record as never);
  if (error) throw new Error(error.message);
  return true;
}

export async function adminDelete(table: string, id: string) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
