import { Building2, CalendarHeart, IndianRupee, Stethoscope, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import {
  AppointmentsTrendChart,
  PatientGrowthChart,
  SpecialityPieChart,
  StatusDistributionChart,
} from "@/components/admin/analytics-charts";
import { PageTransition } from "@/components/shared/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAnalytics } from "@/lib/services/admin.server";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const data = await getAdminAnalytics();

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Admin Overview"
          description="A live snapshot of your healthcare network."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={data.totalPatients.toLocaleString()}
            icon={Users}
            trend={12}
            hint="vs last month"
            accent="from-blue-500 to-sky-500"
            delay={0}
          />
          <StatCard
            title="Total Doctors"
            value={data.totalDoctors.toLocaleString()}
            icon={Stethoscope}
            trend={4}
            hint="vs last month"
            accent="from-teal-500 to-emerald-500"
            delay={0.05}
          />
          <StatCard
            title="Total Hospitals"
            value={data.totalHospitals.toLocaleString()}
            icon={Building2}
            trend={2}
            hint="vs last month"
            accent="from-violet-500 to-purple-500"
            delay={0.1}
          />
          <StatCard
            title="Total Appointments"
            value={data.totalAppointments.toLocaleString()}
            icon={CalendarHeart}
            trend={8}
            hint="vs last month"
            accent="from-amber-500 to-orange-500"
            delay={0.15}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AppointmentsTrendChart data={data.appointmentsTrend} />
          </div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">Revenue</CardTitle>
              <CardDescription>Estimated bookings revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold tracking-tight">
                  ₹{(data.revenue / 100000).toFixed(1)}L
                </p>
                <span className="mb-1 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +9.2%
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Average of <span className="font-semibold text-foreground">₹350</span> per appointment across all specialities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PatientGrowthChart data={data.patientGrowth} />
          <SpecialityPieChart data={data.specialityDistribution} />
        </div>

        <StatusDistributionChart data={data.statusDistribution} />
      </div>
    </PageTransition>
  );
}
