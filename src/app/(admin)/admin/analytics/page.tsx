import { Activity, CalendarHeart, Star, Zap } from "lucide-react";
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

export const metadata = { title: "Analytics · Admin" };

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics();

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Analytics"
          description="Deep-dive into platform performance and patient behaviour."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Avg. Appointments / Month"
            value={Math.round(data.totalAppointments / 6).toLocaleString()}
            icon={CalendarHeart}
            trend={8}
            accent="from-blue-500 to-sky-500"
          />
          <StatCard
            title="Avg. Rating"
            value="4.6"
            icon={Star}
            trend={2}
            hint="/ 5"
            accent="from-amber-500 to-orange-500"
            delay={0.05}
          />
          <StatCard
            title="AI Interactions"
            value={data.aiUsage.reduce((acc, a) => acc + a.count, 0).toLocaleString()}
            icon={Zap}
            trend={22}
            hint="this month"
            accent="from-teal-500 to-emerald-500"
            delay={0.1}
          />
          <StatCard
            title="Completion Rate"
            value="72%"
            icon={Activity}
            trend={4}
            accent="from-violet-500 to-purple-500"
            delay={0.15}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AppointmentsTrendChart data={data.appointmentsTrend} />
          <PatientGrowthChart data={data.patientGrowth} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SpecialityPieChart data={data.specialityDistribution} />
          <StatusDistributionChart data={data.statusDistribution} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Usage by Action</CardTitle>
            <CardDescription>Where patients use the AI assistant most</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.aiUsage.map((item) => {
              const max = Math.max(...data.aiUsage.map((i) => i.count), 1);
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={item.action}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-muted-foreground">{item.count.toLocaleString()} calls</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
