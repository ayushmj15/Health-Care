import type { UserProfile } from "@/types";

/**
 * Required personal fields for a "complete" profile.
 * Used to gate the dashboard until onboarding is done.
 */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.full_name?.trim() &&
      profile.gender?.trim() &&
      profile.date_of_birth &&
      profile.blood_group &&
      profile.phone?.trim(),
  );
}

/** Whether the user has at least one emergency contact set up (SOS). */
export function hasEmergencyContact(profile: UserProfile | null, contactCount: number): boolean {
  if (contactCount > 0) return true;
  return Boolean(profile?.emergency_contact?.phone);
}

export function onboardingComplete(profile: UserProfile | null, contactCount: number): boolean {
  return isProfileComplete(profile) && hasEmergencyContact(profile, contactCount);
}
