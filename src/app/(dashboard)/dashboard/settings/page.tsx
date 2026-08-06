import { SettingsForm } from "@/components/settings/settings-form";
import { getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personalize your experience and manage privacy.</p>
      </div>
      <SettingsForm initial={profile?.settings ?? {}} />
    </div>
  );
}
