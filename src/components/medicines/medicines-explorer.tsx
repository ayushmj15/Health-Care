"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Check, Clock, Pill, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { MEDICINE_FREQUENCIES } from "@/lib/constants";
import {
  addMedicine,
  deleteMedicine,
  setReminderStatus,
  toggleMedicine,
} from "@/lib/services/medicines";
import { medicineSchema, type MedicineInput } from "@/lib/validations";
import { formatTime, timeAgo } from "@/lib/utils";
import type { Medicine, Reminder } from "@/types";

export function MedicinesExplorer({
  userId,
  initialMedicines,
  initialReminders,
}: {
  userId: string;
  initialMedicines: Medicine[];
  initialReminders: Reminder[];
}) {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [reminders, setReminders] = useState(initialReminders);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<MedicineInput>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "once_daily",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
    },
  });

  const frequency = form.watch("frequency");
  const presetTimes = useMemo(
    () => MEDICINE_FREQUENCIES.find((f) => f.value === frequency)?.times ?? [],
    [frequency],
  );

  const todayReminders = reminders
    .filter((r) => new Date(r.scheduled_at).toDateString() === new Date().toDateString())
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

  async function onSubmit(values: MedicineInput) {
    setSaving(true);
    try {
      const created = await addMedicine({
        patient_id: userId,
        name: values.name,
        dosage: values.dosage,
        frequency: values.frequency,
        times: [...presetTimes],
        start_date: values.startDate,
        end_date: values.endDate || null,
        notes: values.notes,
      });
      setMedicines((prev) => [created, ...prev]);
      toast.success(`${values.name} added. We'll remind you on time!`);
      setOpen(false);
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add medicine.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(id: string, active: boolean) {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, active } : m)));
    try {
      await toggleMedicine(id, active);
    } catch {
      // demo mode
    }
  }

  async function remove(id: string) {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    toast.success("Medicine removed.");
    try {
      await deleteMedicine(id);
    } catch {
      // demo mode
    }
  }

  async function mark(reminder: Reminder, status: "taken" | "missed") {
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? { ...r, status } : r)));
    if (status === "taken") toast.success("Recorded as taken. 💪");
    try {
      await setReminderStatus(reminder.id, status);
    } catch {
      // demo mode
    }
  }

  const freqLabel = (f: Medicine["frequency"]) => MEDICINE_FREQUENCIES.find((x) => x.value === f)?.label ?? f;

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add medicine
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Medicines list */}
        <div className="space-y-4 lg:col-span-2">
          {medicines.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medicines yet"
              description="Add your medicines with dosage and timing to start receiving reminders."
              action={
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" /> Add your first medicine
                </Button>
              }
            />
          ) : (
            medicines.map((m) => (
              <div key={m.id} className={`rounded-2xl border bg-card p-4 transition-opacity ${!m.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/15 text-teal">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.dosage ?? "—"} · {freqLabel(m.frequency)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {m.times.map((t) => (
                          <Badge key={t} variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" /> {formatTime(t)}
                          </Badge>
                        ))}
                        {m.times.length === 0 && (
                          <Badge variant="ghost" className="text-[10px]">
                            As needed
                          </Badge>
                        )}
                      </div>
                      {m.notes && <p className="mt-1.5 text-xs text-muted-foreground">{m.notes}</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Switch checked={m.active} onCheckedChange={(v) => toggle(m.id, v)} aria-label="Active" />
                    <Button variant="ghost" size="iconSm" aria-label="Remove" onClick={() => remove(m.id)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's reminders */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Today&apos;s schedule</h3>
            </div>
            <div className="mt-4 space-y-3">
              {todayReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reminders scheduled for today.</p>
              ) : (
                todayReminders.map((r) => (
                  <div key={r.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{r.medicine?.name ?? "Medicine"}</p>
                      <span className="text-xs font-semibold text-primary">
                        {formatTime(new Date(r.scheduled_at).toTimeString().slice(0, 5))}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.medicine?.dosage ?? ""} · {timeAgo(r.scheduled_at)}
                    </p>
                    {r.status === "pending" ? (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="teal" className="flex-1" onClick={() => mark(r, "taken")}>
                          <Check className="h-3.5 w-3.5" /> Taken
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => mark(r, "missed")}>
                          Missed
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={r.status === "taken" ? "success" : "destructive"} className="mt-2 capitalize">
                        {r.status === "taken" ? "Taken ✓" : r.status}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reminder history */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-base font-semibold">Reminder history</h3>
            <div className="mt-4 space-y-2.5">
              {reminders.slice(1, 7).map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        r.status === "taken"
                          ? "bg-emerald-500"
                          : r.status === "missed"
                            ? "bg-red-500"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <span className="font-medium">{r.medicine?.name ?? "Medicine"}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatTime(new Date(r.scheduled_at).toTimeString().slice(0, 5))} ·{" "}
                    {new Date(r.scheduled_at).toLocaleDateString("en", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add medicine dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a medicine</DialogTitle>
            <DialogDescription>
              Set the dosage and timing — we&apos;ll send push and in-app reminders.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Amlodipine 5mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5 mg / 1 tablet" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MEDICINE_FREQUENCIES.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {presetTimes.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Reminder times: {presetTimes.map(formatTime).join(", ")}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Take after breakfast" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="teal" disabled={saving}>
                  {saving ? "Saving…" : "Save medicine"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
