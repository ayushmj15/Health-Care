import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { PageTransition } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { getAdminList } from "@/lib/services/admin.server";
import type { Appointment } from "@/types";

export const metadata = { title: "Appointments · Admin" };

const STATUS_VARIANT: Record<Appointment["status"], "success" | "default" | "warning" | "secondary" | "destructive"> = {
  confirmed: "success",
  completed: "default",
  pending: "warning",
  cancelled: "secondary",
  no_show: "destructive",
};

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1) || 1);
  const { rows, total } = await getAdminList("appointments", currentPage, search ?? "");
  const appointments = rows as unknown as Appointment[];

  const columns: AdminColumn<Appointment>[] = [
    {
      key: "date",
      header: "Date",
      render: (a) => (
        <div>
          <p className="font-medium">
            {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {a.start_time}–{a.end_time}
          </p>
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      render: (a) => (
        <div>
          <p className="font-medium">{a.doctor?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{a.doctor?.speciality ?? ""}</p>
        </div>
      ),
    },
    {
      key: "hospital",
      header: "Hospital",
      render: (a) => <span className="text-muted-foreground">{a.hospital?.name ?? "—"}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (a) =>
        a.type === "video" ? <Badge variant="teal">Video</Badge> : <Badge variant="outline">In-person</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <Badge variant={STATUS_VARIANT[a.status]} className="capitalize">
          {a.status.replace("_", " ")}
        </Badge>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Appointments"
          description="Review and manage all bookings across the network."
        />

        <AdminTable
          columns={columns}
          data={appointments}
          total={total}
          page={currentPage}
          basePath="/admin/appointments"
          search={search}
          searchPlaceholder="Search appointments…"
        />
      </div>
    </PageTransition>
  );
}
