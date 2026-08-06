import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  trend,
  accent = "from-blue-500 to-teal-500",
  delay = 0,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: number;
  accent?: string;
  delay?: number;
}) {
  const positive = (trend ?? 0) >= 0;

  return (
    <FadeIn delay={delay}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <div className="flex items-center gap-2">
                {trend !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                      positive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400",
                    )}
                  >
                    {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(trend)}%
                  </span>
                )}
                {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
              </div>
            </div>
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg", accent)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
