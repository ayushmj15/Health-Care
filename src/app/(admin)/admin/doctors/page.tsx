import { Plus, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { PageTransition } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminList } from "@/lib/services/admin.server";
import type { Doctor } from "@/types";

export const metadata = { title: "Doctors · Admin" };

export default async function AdminDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1) || 1);
  const { rows, total } = await getAdminList("doctors", currentPage, search ?? "");
  const doctors = rows as unknown as Doctor[];

  const columns: AdminColumn<Doctor>[] = [
    {
      key: "name",
      header: "Doctor",
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-xs font-bold text-white">
            {d.name.replace("Dr. ", "").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{d.name}</p>
            {d.qualifications && <p className="text-xs text-muted-foreground">{d.qualifications}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "speciality",
      header: "Speciality",
      render: (d) => <Badge variant="secondary">{d.speciality}</Badge>,
    },
    {
      key: "hospital",
      header: "Hospital",
      render: (d) => (
        <span className="text-muted-foreground">{d.hospital?.name ?? "Independent"}</span>
      ),
    },
    {
      key: "experience",
      header: "Experience",
      render: (d) => <span className="tabular-nums">{d.experience_years} yrs</span>,
    },
    {
      key: "fee",
      header: "Fee",
      render: (d) => (
        <span className="font-medium tabular-nums">₹{d.fee.toLocaleString()}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (d) => (
        <span className="inline-flex items-center gap-1 font-medium">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {d.rating.toFixed(1)}
        </span>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="Doctors"
          description="Manage doctors and their availability."
        >
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add doctor
          </Button>
        </AdminPageHeader>

        <AdminTable
          columns={columns}
          data={doctors}
          total={total}
          page={currentPage}
          basePath="/admin/doctors"
          search={search}
          searchPlaceholder="Search doctors…"
        />
      </div>
    </PageTransition>
  );
}
