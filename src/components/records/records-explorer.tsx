"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Brain,
  Download,
  Droplets,
  FileText,
  Folder,
  History,
  Loader2,
  ScanLine,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { REPORT_CATEGORIES } from "@/lib/constants";
import { addReport, deleteReport, uploadRecordFile, resolveRecordFileUrl } from "@/lib/services/records";
import { reportSchema, type ReportInput } from "@/lib/validations";
import { formatBytes, formatDate } from "@/lib/utils";
import type { Report, ReportCategory } from "@/types";

const ICONS: Record<ReportCategory, typeof FileText> = {
  prescription: FileText,
  blood_report: Droplets,
  xray: ScanLine,
  mri: Brain,
  ct_scan: ScanLine,
  vaccination: ShieldCheck,
  allergy: ShieldCheck,
  medical_history: History,
  other: Folder,
};

const COLOR: Record<ReportCategory, string> = {
  prescription: "text-violet-500 bg-violet-500/10",
  blood_report: "text-red-500 bg-red-500/10",
  xray: "text-amber-500 bg-amber-500/10",
  mri: "text-teal bg-teal/10",
  ct_scan: "text-sky-500 bg-sky-500/10",
  vaccination: "text-emerald-500 bg-emerald-500/10",
  allergy: "text-orange-500 bg-orange-500/10",
  medical_history: "text-blue-500 bg-blue-500/10",
  other: "text-muted-foreground bg-muted",
};

export function RecordsExplorer({
  userId,
  initialReports,
}: {
  userId: string;
  initialReports: Report[];
}) {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preview, setPreview] = useState<Report | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      category: "blood_report",
      description: "",
      labName: "",
      reportDate: new Date().toISOString().split("T")[0],
    },
  });

  const filtered = useMemo(() => {
    let list = [...reports];
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (search) list = list.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [reports, search, category]);

  async function onSubmit(values: ReportInput) {
    setUploading(true);
    try {
      let fileUrl: string | null = null;
      let fileType: string | null = null;
      let fileSize: number | null = null;

      if (file) {
        fileUrl = await uploadRecordFile(userId, file);
        fileType = file.type;
        fileSize = file.size;
        toast.success(`"${file.name}" uploaded successfully.`);
      }

      const created = await addReport({
        patient_id: userId,
        title: values.title,
        category: values.category,
        description: values.description,
        lab_name: values.labName,
        report_date: values.reportDate,
        file_url: fileUrl || null,
        file_type: fileType,
        file_size: fileSize,
      });

      setReports((prev) => [created, ...prev]);
      toast.success("Report added to your records.");
      setUploadOpen(false);
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload report.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(report: Report) {
    try {
      await deleteReport(report.id);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      toast.success("Report deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete report.");
    }
  }

  function download(report: Report) {
    const url = resolveRecordFileUrl(report.file_url);
    if (!url) {
      toast.info("No file attached to this record.");
      return;
    }
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search records…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "All" }, ...REPORT_CATEGORIES].map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:border-primary/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Button className="sm:ml-auto" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" /> Upload record
        </Button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No records found"
          description="Upload prescriptions, lab reports, scans and vaccination records to keep everything in one place."
          action={
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload your first record
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const Icon = ICONS[r.category] ?? FileText;
            const catLabel = REPORT_CATEGORIES.find((c) => c.value === r.category)?.label ?? "Other";
            return (
              <div key={r.id} className="group rounded-2xl border bg-card p-4 transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <button type="button" onClick={() => setPreview(r)} className="flex items-start gap-3 text-left">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLOR[r.category]}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <p className="line-clamp-2 text-sm font-semibold hover:underline">{r.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {catLabel} · {formatDate(r.report_date)}
                      </p>
                    </span>
                  </button>
                </div>
                {r.description && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    {r.lab_name ?? "—"} · {formatBytes(r.file_size)}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="iconSm" aria-label="Download" onClick={() => download(r)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="iconSm" aria-label="Delete" onClick={() => remove(r)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a health record</DialogTitle>
            <DialogDescription>
              Add prescriptions, blood reports, X-rays, MRI, CT scans, vaccination records and more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Complete Blood Count — Jan 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REPORT_CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="labName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab / facility (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MedPlus Diagnostics" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Key findings, doctor's notes…" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>File (PDF / image)</FormLabel>
                <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors hover:border-primary/40 hover:bg-accent">
                  {file ? (
                    <>
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="mt-2 text-sm font-semibold">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatBytes(file.size)} · ready to upload</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="mt-2 text-sm font-medium">Click to choose a file</span>
                      <span className="text-xs text-muted-foreground">PDF, JPG or PNG · up to 25 MB</span>
                    </>
                  )}
                  <input
                    id="report-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save record
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              {preview && formatDate(preview.report_date)}
              {preview?.lab_name ? ` · ${preview.lab_name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border bg-muted/20 p-6">
            {(() => {
              const p = preview;
              const fileUrl = p ? resolveRecordFileUrl(p.file_url) : null;
              if (!p || !fileUrl) {
                return (
                  <div className="text-center">
                    <Folder className="mx-auto h-12 w-12 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">No attached file</p>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      This record was created without a file.
                    </p>
                  </div>
                );
              }
              return p.file_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fileUrl} alt={p.title} className="max-h-[420px] rounded-lg object-contain" />
              ) : (
                <iframe src={fileUrl} className="h-[420px] w-full rounded-lg border" title={p.title} />
              );
            })()}
          </div>
          {preview?.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{preview.description}</p>
          )}
          {preview?.file_url && (
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                const url = resolveRecordFileUrl(preview!.file_url);
                if (url) window.open(url, "_blank");
              }}>
                <Download className="h-4 w-4" /> Open file
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
