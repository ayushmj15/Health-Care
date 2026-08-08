"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Siren, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  "Your full name, gender and date of birth",
  "Blood group and phone number",
  "At least one emergency contact (for SOS)",
];

/**
 * Full-screen gate shown while the user hasn't finished onboarding.
 * Keeps Emergency accessible — it must never be blocked.
 */
export function OnboardingGate() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500">
        <UserRound className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">Let&apos;s finish setting up your profile</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your profile powers your emergency SOS and helps doctors treat you faster. It takes less than a minute.
      </p>

      <Card className="mt-8 w-full text-left">
        <CardContent className="space-y-3 p-6">
          {STEPS.map((step) => (
            <div key={step} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
              <span className="text-muted-foreground">{step}</span>
            </div>
          ))}
          <div className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/5 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Until your profile is complete, the rest of the app stays locked. This keeps your health data accurate
              and your emergency SOS ready.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/profile">
            Complete my profile <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="destructive" asChild>
          <Link href="/dashboard/emergency">
            <Siren className="h-4 w-4" /> Emergency
          </Link>
        </Button>
      </div>
    </div>
  );
}
