import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { PageTransition } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { getAdminList } from "@/lib/services/admin.server";

interface AdminPatient {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  blood_group: string | null;
  appointments: number;
  joined: string;
  status: string;
}

export const metadata = { title: "Patients · Admin" };

export default async function AdminPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1) || 1);
  const { rows, total } = await getAdminList("users", currentPage, search ?? "");
  const patients = rows as unknown as AdminPatient[];

  const columns: AdminColumn<AdminPatient>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-bold text-white">
            {p.full_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{p.full_name}</p>
            <p className="text-xs text-muted-foreground">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (p) => <span className="text-muted-foreground">{p.phone ?? "—"}</span>,
    },
    {
      key: "blood",
      header: "Blood group",
      render: (p) =>
        p.blood_group ? <Badge variant="outline">{p.blood_group}</Badge> : <span>—</span>,
    },
    {
      key: "appointments",
      header: "Appointments",
      render: (p) => <span className="tabular-nums">{p.appointments}</span>,
    },
    {
      key: "joined",
      header: "Joined",
      render: (p) => (
        <span className="text-muted-foreground">
          {new Date(p.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) =>
        p.status === "active" ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Patients"
          description="Every patient registered on the platform."
        />

        <AdminTable
          columns={columns}
          data={patients}
          total={total}
          page={currentPage}
          basePath="/admin/patients"
          search={search}
          searchPlaceholder="Search patients…"
        />
      </div>
    </PageTransition>
  );
}
