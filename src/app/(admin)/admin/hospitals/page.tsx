import { Plus, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { PageTransition } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminList } from "@/lib/services/admin.server";
import type { Hospital } from "@/types";

export const metadata = { title: "Hospitals · Admin" };

export default async function AdminHospitalsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1) || 1);
  const { rows, total } = await getAdminList("hospitals", currentPage, search ?? "");
  const hospitals = rows as unknown as Hospital[];

  const columns: AdminColumn<Hospital>[] = [
    {
      key: "name",
      header: "Hospital",
      render: (h) => (
        <div className="flex items-center gap-3">
          {h.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={h.image_url}
              alt=""
              className="h-9 w-9 rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-xs font-bold">{h.name.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
          <div>
            <p className="font-medium">{h.name}</p>
            <p className="text-xs text-muted-foreground">{h.address}</p>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "City",
      render: (h) => <span className="text-muted-foreground">{h.city ?? "—"}</span>,
    },
    {
      key: "specialities",
      header: "Specialities",
      className: "max-w-[220px]",
      render: (h) => (
        <div className="flex flex-wrap gap-1">
          {h.specialities.slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="font-normal">
              {s}
            </Badge>
          ))}
          {h.specialities.length > 3 && (
            <Badge variant="ghost" className="font-normal">
              +{h.specialities.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (h) => (
        <span className="inline-flex items-center gap-1 font-medium">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {h.rating.toFixed(1)}
          <span className="text-xs font-normal text-muted-foreground">({h.reviews_count.toLocaleString()})</span>
        </span>
      ),
    },
    {
      key: "emergency",
      header: "Emergency",
      render: (h) =>
        h.emergency ? (
          <Badge variant="destructive">24/7</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "active",
      header: "Status",
      render: (h) =>
        h.is_active ? (
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
          title="Hospitals"
          description="Manage partner hospitals across the network."
        >
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add hospital
          </Button>
        </AdminPageHeader>

        <AdminTable
          columns={columns}
          data={hospitals}
          total={total}
          page={currentPage}
          basePath="/admin/hospitals"
          search={search}
          searchPlaceholder="Search hospitals…"
        />
      </div>
    </PageTransition>
  );
}
