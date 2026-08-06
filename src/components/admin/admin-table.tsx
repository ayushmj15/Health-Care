"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface AdminColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  total,
  page,
  perPage = 10,
  basePath,
  search = "",
  searchPlaceholder = "Search…",
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
}: {
  columns: AdminColumn<T>[];
  data: T[];
  total: number;
  page: number;
  perPage?: number;
  basePath: string;
  search?: string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const router = useRouter();
  const [term, setTerm] = useState(search);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  function navigate(params: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    router.push(`${basePath}?${query}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: term, page: "1" });
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b p-4">
          <form onSubmit={onSearch} className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label={searchPlaceholder}
            />
          </form>
          <p className="ml-auto hidden text-sm text-muted-foreground sm:block">
            {total.toLocaleString()} total
          </p>
        </div>

        {data.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} className="border-0" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t p-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{from}</span>–<span className="font-medium text-foreground">{to}</span> of{" "}
            <span className="font-medium text-foreground">{total.toLocaleString()}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => navigate({ search, page: String(page - 1) })}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => navigate({ search, page: String(page + 1) })}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
