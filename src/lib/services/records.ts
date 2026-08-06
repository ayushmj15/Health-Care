import type { Report } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ============================================================================
// Client-safe health record mutations.
// Called from client components — uses the browser Supabase client.
// Server-side reads live in "./records.server.ts".
// ============================================================================

export interface NewReport {
  patient_id: string;
  title: string;
  category: Report["category"];
  description?: string;
  lab_name?: string;
  report_date: string;
  file_url?: string | null;
  file_type?: string | null;
  file_size?: number | null;
}

/** Add a record (metadata + optional file URL). */
export async function addReport(input: NewReport): Promise<Report> {
  if (!isSupabaseConfigured()) {
    return {
      id: `r${Date.now()}`,
      patient_id: input.patient_id,
      title: input.title,
      category: input.category,
      description: input.description ?? null,
      lab_name: input.lab_name ?? null,
      report_date: input.report_date,
      file_url: input.file_url ?? null,
      file_type: input.file_type ?? null,
      file_size: input.file_size ?? null,
      created_at: new Date().toISOString(),
    };
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { data, error } = await supabase.from("reports").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Report;
}

/** Delete a record. */
export async function deleteReport(reportId: string) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("reports").delete().eq("id", reportId);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Upload a file to the `records` bucket under the user's folder.
 * Returns the storage path (empty string in demo mode).
 */
export async function uploadRecordFile(userId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured()) return "";
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from("records").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

/** Build a public/signed URL for a stored record file. */
export async function getRecordFileUrl(userId: string, path: string) {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { data } = await supabase.storage.from("records").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
