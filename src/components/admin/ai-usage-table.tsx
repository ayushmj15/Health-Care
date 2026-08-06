"use client";

import { Bot, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { timeAgo } from "@/lib/utils";
import type { AiUsage } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  general: "General question",
  symptom: "Symptom check",
  report: "Report explanation",
  specialist: "Specialist suggestion",
  tips: "Preventive tips",
};

export function AiUsageTable({ rows }: { rows: AiUsage[] }) {
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    const q = term.toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.action, r.model, r.user_id ?? ""].join(" ").toLowerCase().includes(q),
    );
  }, [rows, term]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);
  const totalTokens = rows.reduce((acc, r) => acc + (r.tokens_in ?? 0) + (r.tokens_out ?? 0), 0);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by action or model…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant="secondary">
              {rows.length} calls
            </Badge>
            <Badge variant="teal">{totalTokens.toLocaleString()} tokens</Badge>
          </div>
        </div>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="No AI usage found"
            description="AI interactions will appear here once patients chat with the assistant."
            className="border-0"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Tokens in</TableHead>
                  <TableHead className="text-right">Tokens out</TableHead>
                  <TableHead className="text-right">Latency</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Bot className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium capitalize">{ACTION_LABELS[r.action] ?? r.action}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.model ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.tokens_in?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.tokens_out?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.latency_ms ? `${(r.latency_ms / 1000).toFixed(1)}s` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{timeAgo(r.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 border-t p-4">
            <p className="text-sm text-muted-foreground">
              Showing {pageRows.length} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 text-sm text-muted-foreground">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
