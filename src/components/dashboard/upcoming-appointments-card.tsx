import { CalendarDays, Clock, MapPin, Stethoscope, Video } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatTime } from "@/lib/utils";
import type { Appointment } from "@/types";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  completed: "secondary",
  cancelled: "destructive",
  no_show: "destructive",
};

export function UpcomingAppointments({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CalendarDays}
            title="No upcoming visits"
            description="Book your next appointment in a couple of taps."
            action={
              <Link href="/dashboard/appointments" className="text-sm font-medium text-primary hover:underline">
                Book an appointment
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Upcoming appointments</CardTitle>
        <Link href="/dashboard/appointments" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.slice(0, 3).map((a) => (
          <div
            key={a.id}
            className="flex items-start gap-4 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-sm font-bold leading-none">{new Date(a.appointment_date).getDate()}</span>
              <span className="text-[10px] uppercase">
                {new Date(a.appointment_date).toLocaleDateString("en", { month: "short" })}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">{a.doctor?.name ?? "Doctor"}</p>
                <Badge variant={STATUS_VARIANT[a.status] ?? "secondary"} className="capitalize">
                  {a.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.doctor?.speciality}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(a.start_time)}
                </span>
                <span className="inline-flex items-center gap-1">
                  {a.type === "video" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                  {a.type === "video" ? "Video consult" : a.hospital?.name ?? "In-person"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {formatDate(a.appointment_date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
