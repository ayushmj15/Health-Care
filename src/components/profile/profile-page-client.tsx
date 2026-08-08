"use client";

import { ArrowRight, Check, Circle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProfileForm } from "@/components/profile/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEmergencyContacts } from "@/lib/services/profile";
import { isProfileComplete } from "@/lib/profile-utils";
import { initials } from "@/lib/utils";
import type { EmergencyContact, UserProfile } from "@/types";

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      {done ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <span className={done ? "" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}

export function ProfilePageClient({
  user,
  contacts,
}: {
  user: UserProfile;
  contacts: EmergencyContact[];
}) {
  const [profile, setProfile] = useState(user);
  const [contactCount, setContactCount] = useState(contacts.length);
  const [justSaved, setJustSaved] = useState(false);

  const personalDone = isProfileComplete(profile);
  const emergencyDone = contactCount > 0 || Boolean(profile.emergency_contact?.phone);
  const allDone = personalDone && emergencyDone;

  async function handleSaved(saved: UserProfile | null) {
    if (saved) setProfile(saved);
    try {
      const list = await getEmergencyContacts(user.id);
      setContactCount(list.length);
    } catch {
      // demo mode — ignore
    }
    setJustSaved(true);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personal and medical details — used by doctors and responders.
        </p>
      </div>

      {/* Onboarding checklist */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              {allDone ? "Profile complete" : "Complete your profile to unlock the app"}
            </p>
            <Badge variant={allDone ? "success" : "warning"}>
              {allDone ? "All done" : "Required"}
            </Badge>
          </div>
          <ul className="mt-4 space-y-2">
            <ChecklistItem done={personalDone} label="Personal details — name, gender, date of birth, blood group & phone" />
            <ChecklistItem done={emergencyDone} label="Emergency contact (used for SOS alerts)" />
          </ul>
          {allDone && (
            <Button size="sm" asChild className="mt-4">
              <Link href="/dashboard">
                Continue to dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {justSaved && !allDone && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
              Saved — a few fields are still missing. Finish them and the app unlocks automatically.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Header card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? "User"} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-teal text-2xl text-white">
              {initials(profile.full_name ?? profile.email)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{profile.full_name ?? "Set your name"}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              <Badge variant="secondary" className="capitalize">
                {profile.role}
              </Badge>
              {profile.blood_group && <Badge variant="destructive">{profile.blood_group}</Badge>}
              {profile.phone && <Badge variant="outline">{profile.phone}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <ProfileForm user={profile} onSaved={handleSaved} />
        </CardContent>
      </Card>
    </div>
  );
}
