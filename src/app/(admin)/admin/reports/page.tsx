import { Download, FileBarChart, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageTransition } from "@/components/shared/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminAnalytics } from "@/lib/services/admin.server";

export const metadata = { title: "Reports · Admin" };

const REPORT_TEMPLATES = [
  {
    title: "Patient Registrations",
    description: "Monthly sign-ups and demographic breakdown.",
    icon: FileText,
    type: "PDF",
  },
  {
    title: "Appointment Summary",
    description: "Bookings, cancellations, no-shows and completion rates.",
    icon: FileBarChart,
    type: "PDF",
  },
  {
    title: "Revenue Report",
    description: "Consultation revenue by hospital and speciality.",
    icon: FileSpreadsheet,
    type: "XLSX",
  },
  {
    title: "AI Usage Report",
    description: "Gemini token consumption and latency trends.",
    icon: FileBarChart,
    type: "CSV",
  },
];

export default async function AdminReportsPage() {
  const data = await getAdminAnalytics();
  const thisMonth = data.appointmentsTrend[data.appointmentsTrend.length - 1];

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Reports"
          description="Generate and export platform reports."
        >
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </AdminPageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REPORT_TEMPLATES.map((report) => (
            <Card key={report.title} className="group transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <report.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{report.type}</Badge>
                </div>
                <CardTitle className="pt-3 text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Generated {thisMonth.month} {new Date().getFullYear()}
                </p>
                <Button size="sm" variant="ghost" className="gap-1 text-primary">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest events across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                {[
                  { title: "New hospital onboarded", detail: "Heartbeat Cardiac Centre joined the network", time: "2 hours ago" },
                  { title: "Appointment spike", detail: `${thisMonth.appointments.toLocaleString()} bookings this month — up ${Math.round((thisMonth.appointments / (data.appointmentsTrend[0]?.appointments || 1) - 1) * 100)}% since ${data.appointmentsTrend[0]?.month}`, time: "Yesterday" },
                  { title: "AI assistant crossed milestone", detail: `${data.aiUsage.reduce((a, r) => a + r.count, 0).toLocaleString()} AI interactions served`, time: "3 days ago" },
                  { title: "Patient growth", detail: `${data.patientGrowth[data.patientGrowth.length - 1]?.patients.toLocaleString() ?? 0} registered patients to date`, time: "Last week" },
                ].map((item) => (
                  <div key={item.title} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20" />
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Snapshot</CardTitle>
              <CardDescription>Highlights for {thisMonth.month} {new Date().getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Appointments", value: thisMonth.appointments.toLocaleString() },
                { label: "Patients", value: data.patientGrowth[data.patientGrowth.length - 1]?.patients.toLocaleString() ?? "—" },
                { label: "Revenue", value: `₹${(data.revenue / 100000).toFixed(1)}L` },
                { label: "Satisfaction", value: "98%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold tabular-nums">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
