import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getProfile } from "@/lib/services/profile.server";
import { isDemo } from "@/lib/demo-helpers";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  // Real auth guard — only admins may access /admin.
  if (isSupabaseConfigured() && (!profile || profile.role !== "admin")) {
    redirect("/dashboard");
  }

  // In demo mode, elevate the profile to admin so the full admin UI is explorable.
  const user = isDemo && profile ? { ...profile, role: "admin" as const } : profile;

  return (
    <DashboardShell user={user} isDemo={isDemo}>
      {children}
    </DashboardShell>
  );
}
