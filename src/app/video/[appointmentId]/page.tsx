import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoRoom } from "@/components/video/video-room";
import { Button } from "@/components/ui/button";
import { getAppointments } from "@/lib/services/appointments.server";
import { getProfile } from "@/lib/services/profile.server";
import { videoRoomUrl } from "@/lib/video";

export const metadata = { title: "Video Consultation" };

export default async function VideoAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const profile = await getProfile();
  const userId = profile?.id ?? "demo-user";
  const appointment = (await getAppointments(userId)).find((a) => a.id === appointmentId);

  if (!appointment) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <Link href="/dashboard/appointments" className="text-sm font-medium text-primary hover:underline">
          ← Back to appointments
        </Link>
        <p className="text-sm font-semibold">
          {appointment.doctor?.name ?? "Video consultation"}
        </p>
        <Button size="sm" variant="outline" asChild>
          <a href={videoRoomUrl(appointment.id)} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </Button>
      </header>
      <main className="flex-1 p-4">
        <VideoRoom appointment={appointment} />
      </main>
    </div>
  );
}