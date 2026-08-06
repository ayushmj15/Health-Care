import type { EmergencyContact, UserProfile } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_EMERGENCY_CONTACTS, DEMO_USER } from "@/lib/demo-data";

// ============================================================================
// Server-only helper to read the current user's profile.
// Import from Server Components / Server Actions only.
// ============================================================================

/** Get the current user's profile (from Supabase, or the demo profile). */
export async function getProfile(userId?: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return DEMO_USER;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();
    if (error) throw error;
    if (data) return data as UserProfile;

    // Profile missing (e.g. created outside trigger) — build from auth metadata.
    const profile: Partial<UserProfile> = {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata.full_name as string) ?? null,
      avatar_url: user.user_metadata.avatar_url ?? null,
      role: "patient",
    };
    return profile as UserProfile;
  } catch {
    return DEMO_USER;
  }
}

/** Emergency contacts (server-side). */
export async function getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
  if (!isSupabaseConfigured()) return DEMO_EMERGENCY_CONTACTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("emergency_contacts").select("*").eq("patient_id", patientId);
    if (error) throw error;
    return (data ?? []) as EmergencyContact[];
  } catch {
    return DEMO_EMERGENCY_CONTACTS;
  }
}
