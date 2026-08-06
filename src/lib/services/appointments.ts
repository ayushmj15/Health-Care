import type { Appointment } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ============================================================================
// Client-safe appointment mutations.
// Called from client components — uses the browser Supabase client.
// Server-side reads live in "./appointments.server.ts".
// ============================================================================

export interface NewAppointment {
  patient_id: string;
  hospital_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  type: "in-person" | "video";
  reason?: string;
  notes?: string;
}

/** Book a new appointment. */
export async function createAppointment(input: NewAppointment): Promise<Appointment> {
  if (!isSupabaseConfigured()) {
    const demo: Appointment = {
      id: `a${Date.now()}`,
      patient_id: input.patient_id,
      hospital_id: input.hospital_id,
      doctor_id: input.doctor_id,
      appointment_date: input.appointment_date,
      start_time: input.start_time,
      end_time: input.end_time,
      type: input.type,
      status: "confirmed",
      reason: input.reason ?? null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    };
    return demo;
  }

  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert(input)
    .select("*, doctor:doctors(*), hospital:hospitals(*)")
    .single();
  if (error) throw new Error(error.message);
  return data as Appointment;
}

/** Update appointment status (e.g. cancel). */
export async function updateAppointmentStatus(appointmentId: string, status: Appointment["status"]) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Generate available time slots for a doctor on a date.
 * Slots start at the doctor's available_from time and are 30 minutes long.
 */
export function generateTimeSlots(availableFrom: string, availableTo: string, booked: string[] = [], date?: string): string[] {
  const [sh, sm] = availableFrom.split(":").map(Number);
  const [eh, em] = availableTo.split(":").map(Number);
  const slots: string[] = [];
  const start = new Date(2000, 0, 1, sh, sm);
  const end = new Date(2000, 0, 1, eh, em);

  const isWeekend = date ? new Date(date).getDay() === 0 || new Date(date).getDay() === 6 : false;

  while (start < end) {
    const hh = String(start.getHours()).padStart(2, "0");
    const mm = String(start.getMinutes()).padStart(2, "0");
    const slot = `${hh}:${mm}`;
    if (!booked.includes(slot)) {
      // Simple heuristic: fewer slots on weekends (demo behaviour).
      if (!isWeekend || start.getHours() >= 10) slots.push(slot);
    }
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
}
