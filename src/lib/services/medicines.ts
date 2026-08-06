import type { Medicine, Reminder } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ============================================================================
// Client-safe medicine & reminder mutations.
// Called from client components — uses the browser Supabase client.
// Server-side reads live in "./medicines.server.ts".
// ============================================================================

export interface NewMedicine {
  patient_id: string;
  name: string;
  dosage?: string;
  frequency: Medicine["frequency"];
  times: string[];
  start_date: string;
  end_date?: string | null;
  notes?: string;
}

/** Add a new medicine. */
export async function addMedicine(input: NewMedicine): Promise<Medicine> {
  if (!isSupabaseConfigured()) {
    return {
      id: `m${Date.now()}`,
      patient_id: input.patient_id,
      name: input.name,
      dosage: input.dosage ?? null,
      frequency: input.frequency,
      times: input.times,
      start_date: input.start_date,
      end_date: input.end_date ?? null,
      notes: input.notes ?? null,
      active: true,
      created_at: new Date().toISOString(),
    };
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { data, error } = await supabase.from("medicines").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Medicine;
}

/** Toggle a medicine active/inactive. */
export async function toggleMedicine(medicineId: string, active: boolean) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("medicines").update({ active }).eq("id", medicineId);
  if (error) throw new Error(error.message);
  return true;
}

/** Delete a medicine. */
export async function deleteMedicine(medicineId: string) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("medicines").delete().eq("id", medicineId);
  if (error) throw new Error(error.message);
  return true;
}

/** Mark a reminder as taken / missed. */
export async function setReminderStatus(reminderId: string, status: Reminder["status"]) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase
    .from("reminders")
    .update({ status, taken_at: status === "taken" ? new Date().toISOString() : null })
    .eq("id", reminderId);
  if (error) throw new Error(error.message);
  return true;
}

/** Generate the next week of reminders for a medicine (client-side helper). */
export function buildSchedule(medicine: Medicine, from = new Date()): string[] {
  const times = medicine.times.length ? medicine.times : ["09:00"];
  const start = new Date(from);
  start.setDate(start.getDate() + 1); // start tomorrow
  const occurrences: string[] = [];
  for (let d = 0; d < 7; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);
    if (medicine.frequency === "weekly" && day.getDay() !== 0) continue;
    for (const t of times) {
      const [hh, mm] = t.split(":").map(Number);
      day.setHours(hh, mm, 0, 0);
      occurrences.push(day.toISOString());
    }
  }
  return occurrences;
}
