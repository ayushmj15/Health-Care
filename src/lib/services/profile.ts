import type { EmergencyContact, UserProfile } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_EMERGENCY_CONTACTS, DEMO_USER } from "@/lib/demo-data";

// ============================================================================
// Client-safe profile mutations.
// Called from client components — uses the browser Supabase client.
// Server-side profile reads live in "./profile.server.ts".
// ============================================================================

/** Update the current user's profile. */
export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return { ...DEMO_USER, ...patch };
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("users").update(patch).eq("id", patch.id!);
  if (error) throw new Error(error.message);

  const { data } = await supabase.from("users").select("*").eq("id", patch.id!).maybeSingle();
  return (data as UserProfile) ?? null;
}

/** Emergency contacts */
export async function getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
  if (!isSupabaseConfigured()) return DEMO_EMERGENCY_CONTACTS;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = await createClient();
    const { data, error } = await supabase.from("emergency_contacts").select("*").eq("patient_id", patientId);
    if (error) throw error;
    return (data ?? []) as EmergencyContact[];
  } catch {
    return DEMO_EMERGENCY_CONTACTS;
  }
}

export async function addEmergencyContact(input: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
  if (!isSupabaseConfigured()) {
    return { id: `ec${Date.now()}`, ...input };
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { data, error } = await supabase.from("emergency_contacts").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as EmergencyContact;
}

export async function deleteEmergencyContact(contactId: string) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const { error } = await supabase.from("emergency_contacts").delete().eq("id", contactId);
  if (error) throw new Error(error.message);
  return true;
}

/** Save settings. */
export async function saveSettings(settings: UserProfile["settings"]) {
  if (!isSupabaseConfigured()) return true;
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("users").update({ settings }).eq("id", user.id);
  if (error) throw new Error(error.message);
  return true;
}
