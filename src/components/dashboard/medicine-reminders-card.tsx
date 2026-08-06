"use client";

import { Check, Pill } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatTime } from "@/lib/utils";
import { setReminderStatus } from "@/lib/services/medicines";
import type { Reminder } from "@/types";

export function MedicineRemindersCard({ reminders: initial }: { reminders: Reminder[] }) {
  const [reminders, setReminders] = useState(initial);
  const todays = reminders.filter((r) => r.status === "pending").slice(0, 4);

  async function markTaken(id: string) {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: "taken" } : r)));
    toast.success("Marked as taken. Great job!");
    try {
      await setReminderStatus(id, "taken");
    } catch {
      // demo mode — ignore
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Medicine reminders</CardTitle>
        <Link href="/dashboard/medicines" className="text-xs font-medium text-primary hover:underline">
          Manage
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {todays.length === 0 && (
          <EmptyState icon={Pill} title="All clear" description="No pending medicine reminders today." />
        )}
        {todays.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/15 text-teal">
                <Pill className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.medicine?.name ?? "Medicine"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(new Date(r.scheduled_at).toTimeString().slice(0, 5))}
                  {r.medicine?.dosage ? ` · ${r.medicine.dosage}` : ""}
                </p>
              </div>
            </div>
            <Button size="sm" variant="teal" onClick={() => markTaken(r.id)}>
              <Check className="h-4 w-4" /> Taken
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
