import { redirect } from "next/navigation";
import { getProfile, getEmergencyContacts } from "@/lib/services/profile.server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { onboardingComplete } from "@/lib/profile-utils";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isDemo } from "@/lib/demo-helpers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Real auth guard — when Supabase is configured, require a session.
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) redirect("/login");
    } catch {
      redirect("/login");
    }
  }

  const profile = await getProfile();
  const contacts = profile ? await getEmergencyContacts(profile.id) : [];

  return (
    <DashboardShell
      user={profile}
      isDemo={isDemo}
      onboardingRequired={profile ? !onboardingComplete(profile, contacts.length) : false}
    >
      {children}
    </DashboardShell>
  );
}
