import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getProfile, getEmergencyContacts } from "@/lib/services/profile.server";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) return null;

  const contacts = await getEmergencyContacts(profile.id);

  return <ProfilePageClient user={profile} contacts={contacts} />;
}
