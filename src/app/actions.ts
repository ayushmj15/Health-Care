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

/** Admin: insert a new hospital. Demo/no-DB mode is a no-op. */
export async function adminCreateHospital(input: {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  specialities: string[];
  emergency: boolean;
  latitude?: number;
  longitude?: number;
}) {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("hospitals").insert({
      name: input.name,
      address: input.address ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      website: input.website ?? null,
      specialities: input.specialities,
      emergency: input.emergency,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      rating: 0,
      reviews_count: 0,
      is_active: true,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not create hospital." };
  }
}

/** Admin: insert a new doctor. Demo/no-DB mode is a no-op. */
export async function adminCreateDoctor(input: {
  name: string;
  speciality: string;
  qualifications?: string;
  experience_years?: number;
  fee?: number;
  phone?: string;
  whatsapp?: string;
  hospital_id?: string;
}) {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("doctors").insert({
      name: input.name,
      speciality: input.speciality,
      qualifications: input.qualifications ?? null,
      experience_years: input.experience_years ?? 0,
      fee: input.fee ?? 500,
      phone: input.phone ?? null,
      whatsapp: input.whatsapp ?? null,
      hospital_id: input.hospital_id ?? null,
      is_active: true,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not create doctor." };
  }
}
