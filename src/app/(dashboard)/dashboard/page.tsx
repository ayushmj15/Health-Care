import { Suspense } from "react";
import { PageTransition } from "@/components/shared/motion";
import { CardSkeleton } from "@/components/shared/skeletons";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { SosQuickAccess } from "@/components/dashboard/sos-quick-access";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments-card";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { MedicineRemindersCard } from "@/components/dashboard/medicine-reminders-card";
import { RecentReports } from "@/components/dashboard/recent-reports-card";
import { AiRecommendationsCard } from "@/components/dashboard/ai-recommendations-card";
import { getProfile } from "@/lib/services/profile.server";
import { getUpcomingAppointments } from "@/lib/services/appointments.server";
import { getReminders } from "@/lib/services/medicines.server";
import { getReports } from "@/lib/services/records.server";

export const metadata = { title: "Home" };

export default async function DashboardHomePage() {
  const profile = await getProfile();
  if (!profile) return null;

  const userId = profile.id;
  const [appointments, reminders, reports] = await Promise.all([
    getUpcomingAppointments(userId),
    getReminders(userId),
    getReports(userId),
  ]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <WelcomeCard user={profile} />

        <SosQuickAccess />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Suspense fallback={<CardSkeleton />}>
              <UpcomingAppointments appointments={appointments} />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
              <HealthSummary user={profile} />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
              <MedicineRemindersCard reminders={reminders} />
            </Suspense>
          </div>
          <div className="space-y-6">
            <AiRecommendationsCard />
            <Suspense fallback={<CardSkeleton />}>
              <RecentReports reports={reports} />
            </Suspense>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
