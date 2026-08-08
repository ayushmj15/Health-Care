"use client";

import { CalendarX2, Clock, ExternalLink, MapPin, Navigation, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatTime } from "@/lib/utils";
import { updateAppointmentStatus } from "@/lib/services/appointments";
import type { Appointment } from "@/types";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

export function AppointmentList({
  appointments,
  emptyTitle,
  emptyDescription,
  onChanged,
}: {
  appointments: Appointment[];
  emptyTitle?: string;
  emptyDescription?: string;
  onChanged?: () => void;
}) {
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!cancelling) return;
    setBusy(true);
    try {
      await updateAppointmentStatus(cancelling.id, "cancelled");
      toast.success("Appointment cancelled.");
      setCancelling(null);
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel appointment.");
    } finally {
      setBusy(false);
    }
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title={emptyTitle ?? "No appointments here"}
        description={emptyDescription ?? "Book a new appointment to get started."}
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {appointments.map((a) => {
          const cancellable = a.status === "pending" || a.status === "confirmed";
          return (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-teal/10 text-primary">
                  <span className="text-lg font-bold leading-none">{new Date(a.appointment_date).getDate()}</span>
                  <span className="text-[10px] uppercase">
                    {new Date(a.appointment_date).toLocaleDateString("en", { month: "short" })}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{a.doctor?.name ?? "Doctor"}</p>
                    <Badge variant={STATUS_VARIANT[a.status] ?? "secondary"} className="capitalize">
                      {a.status}
                    </Badge>
                    <Badge variant="ghost" className="capitalize">
                      {a.type}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.doctor?.speciality} · {a.hospital?.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(a.start_time)} – {formatTime(a.end_time)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {a.type === "video" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                      {a.type === "video" ? "Video consult" : a.hospital?.address ?? "In-person"}
                    </span>
                  </div>
                  {a.reason && <p className="mt-1 text-xs italic text-muted-foreground">“{a.reason}”</p>}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  {a.hospital?.website && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={a.hospital.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Website
                      </a>
                    </Button>
                  )}
                  {a.type === "in-person" && a.hospital && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={
                          a.hospital.latitude != null && a.hospital.longitude != null
                            ? `https://www.google.com/maps/dir/?api=1&destination=${a.hospital.latitude},${a.hospital.longitude}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.hospital.name)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Directions
                      </a>
                    </Button>
                  )}
                  {cancellable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setCancelling(a)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!cancelling} onOpenChange={(o) => !o && setCancelling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this appointment?</DialogTitle>
            <DialogDescription>
              {cancelling?.doctor?.name} on {cancelling && formatDate(cancelling.appointment_date)} at{" "}
              {cancelling && formatTime(cancelling.start_time)} will be cancelled. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelling(null)}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={cancel} disabled={busy}>
              {busy ? "Cancelling…" : "Yes, cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
