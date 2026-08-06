import { BookingFlow } from "@/components/appointments/booking-flow";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAppointments } from "@/lib/services/appointments.server";
import { getDoctors, getHospitals } from "@/lib/services/hospitals.server";
import { getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "Appointments" };

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ hospital?: string }>;
}) {
  const { hospital } = await searchParams;
  const [profile, hospitals, doctors] = await Promise.all([
    getProfile(),
    getHospitals(),
    getDoctors(),
  ]);
  const userId = profile?.id ?? "demo-user";

  const all = await getAppointments(userId);
  const today = new Date().toISOString().split("T")[0];
  const upcoming = all
    .filter((a) => a.appointment_date >= today && (a.status === "confirmed" || a.status === "pending"))
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
  const past = all
    .filter((a) => a.appointment_date < today || a.status === "completed" || a.status === "cancelled" || a.status === "no_show")
    .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Book, manage and track your visits.</p>
      </div>

      <Tabs defaultValue="book">
        <TabsList>
          <TabsTrigger value="book">Book new</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="mt-4">
          <BookingFlow
            userId={userId}
            hospitals={hospitals}
            doctors={doctors}
            initialHospitalId={hospital}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <AppointmentList
            appointments={upcoming}
            emptyTitle="No upcoming appointments"
            emptyDescription="Book a visit with a specialist — it takes under a minute."
          />
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <AppointmentList
            appointments={past}
            emptyTitle="No past appointments"
            emptyDescription="Your appointment history will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
