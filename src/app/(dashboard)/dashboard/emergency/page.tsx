import { EmergencyMode } from "@/components/emergency/emergency-mode";
import { getHospitals } from "@/lib/services/hospitals.server";
import { getEmergencyContacts, getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "Emergency" };

export default async function EmergencyPage() {
  const profile = await getProfile();
  const userId = profile?.id ?? "demo-user";
  const [hospitals, contacts] = await Promise.all([getHospitals(), getEmergencyContacts(userId)]);

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-red-500">Emergency mode</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-tap SOS, live location sharing and instant access to nearby emergency care.
        </p>
      </div>
      <EmergencyMode user={profile} hospitals={hospitals} contacts={contacts} />
    </div>
  );
}
