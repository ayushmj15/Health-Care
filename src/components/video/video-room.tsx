"use client";

import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ContactButtons } from "@/components/shared/contact-buttons";
import { Card, CardContent } from "@/components/ui/card";
import { videoRoomUrl } from "@/lib/video";
import { formatDate, formatTime } from "@/lib/utils";
import type { Appointment } from "@/types";

export function VideoRoom({ appointment }: { appointment: Appointment }) {
  const iframeSrc = videoRoomUrl(appointment.id);
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <iframe
              src={iframeSrc}
              allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
              className="h-[60vh] w-full border-0 lg:h-[70vh]"
              title={`Video consult with ${appointment.doctor?.name ?? "doctor"}`}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Consultation</p>
              <p className="mt-1 text-lg font-bold">{appointment.doctor?.name ?? "Doctor"}</p>
              <p className="text-xs text-muted-foreground">
                {appointment.doctor?.speciality} · {appointment.hospital?.name}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                  {formatDate(appointment.appointment_date)}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                  {formatTime(appointment.start_time)}
                </span>
              </div>
              <div className="mt-4">
                <ContactButtons
                  phone={appointment.doctor?.phone}
                  whatsapp={appointment.doctor?.whatsapp}
                  message={`Hi Dr. ${appointment.doctor?.name ?? ""}, I'm waiting in the video call.`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="rounded-2xl border bg-card p-4 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Tips for your call
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>Allow camera and microphone when your browser asks.</li>
              <li>Find a quiet, well-lit spot before joining.</li>
              <li>Keep your medical records handy for the doctor.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}