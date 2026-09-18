"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyticsData } from "@/types";

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (value: string | number) => {
    const s = String(value ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Header "Print" / "Export all" buttons. */
export function ReportToolbar({ data }: { data: AnalyticsData }) {
  function exportAll() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `platform-report-${stamp}.csv`,
      ["Metric", "Value"],
      [
        ["Total patients", data.totalPatients],
        ["Total doctors", data.totalDoctors],
        ["Total hospitals", data.totalHospitals],
        ["Total appointments", data.totalAppointments],
        ["Revenue (₹)", data.revenue],
        ["AI interactions", data.aiUsage.reduce((a, r) => a + r.count, 0)],
      ],
    );
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => window.print()}>
        <Printer className="h-4 w-4" /> Print
      </Button>
      <Button size="sm" variant="outline" onClick={exportAll}>
        <Download className="h-4 w-4" /> Export all
      </Button>
    </>
  );
}

/** Per-template "Export" button on each report card. */
export function ReportExportButton({
  title,
  data,
}: {
  title: string;
  data: AnalyticsData;
}) {
  function handleExport() {
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${stamp}.csv`;

    switch (title) {
      case "Patient Registrations":
        downloadCsv(
          filename,
          ["Month", "Patients"],
          data.patientGrowth.map((r) => [r.month, r.patients]),
        );
        break;
      case "Appointment Summary":
        downloadCsv(
          filename,
          ["Month", "Appointments"],
          data.appointmentsTrend.map((r) => [r.month, r.appointments]),
        );
        break;
      case "Revenue Report":
        downloadCsv(
          filename,
          ["Month", "Appointments", "Est. Revenue (₹)"],
          data.appointmentsTrend.map((r) => [r.month, r.appointments, r.appointments * 350]),
        );
        break;
      case "AI Usage Report":
        downloadCsv(
          filename,
          ["Action", "Calls", "Tokens In", "Tokens Out"],
          data.aiUsage.map((r) => [r.action, r.count, r.tokens_in, r.tokens_out]),
        );
        break;
      default:
        exportAll();
    }
  }

  function exportAll() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `platform-report-${stamp}.csv`,
      ["Metric", "Value"],
      [
        ["Total patients", data.totalPatients],
        ["Total doctors", data.totalDoctors],
        ["Total hospitals", data.totalHospitals],
        ["Total appointments", data.totalAppointments],
        ["Revenue (₹)", data.revenue],
        ["AI interactions", data.aiUsage.reduce((a, r) => a + r.count, 0)],
      ],
    );
  }

  return (
    <Button size="sm" variant="ghost" className="gap-1 text-primary" onClick={handleExport}>
      <Download className="h-4 w-4" /> Export
    </Button>
  );
}