import { FileText, ScanLine, Droplets, Brain, ShieldCheck, AlertTriangle, History, Folder } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatBytes } from "@/lib/utils";
import type { Report, ReportCategory } from "@/types";

const CATEGORY_ICONS: Record<ReportCategory, typeof FileText> = {
  prescription: FileText,
  blood_report: Droplets,
  xray: ScanLine,
  mri: Brain,
  ct_scan: ScanLine,
  vaccination: ShieldCheck,
  allergy: AlertTriangle,
  medical_history: History,
  other: Folder,
};

export function RecentReports({ reports }: { reports: Report[] }) {
  const recent = reports.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent reports</CardTitle>
        <Link href="/dashboard/records" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {recent.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No reports yet"
            description="Upload prescriptions, scans and lab results."
          />
        )}
        {recent.map((r) => {
          const Icon = CATEGORY_ICONS[r.category] ?? FileText;
          return (
            <Link
              key={r.id}
              href="/dashboard/records"
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5 h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(r.report_date)}
                  {r.file_size ? ` · ${formatBytes(r.file_size)}` : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
