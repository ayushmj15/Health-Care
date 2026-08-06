import { Clock3, Coins, Gauge, Zap } from "lucide-react";
import { AiUsageTable } from "@/components/admin/ai-usage-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { PageTransition } from "@/components/shared/motion";
import { getAiUsage } from "@/lib/services/admin.server";

export const metadata = { title: "AI Usage · Admin" };

export default async function AdminAiUsagePage() {
  const rows = await getAiUsage();

  const totalCalls = rows.length;
  const totalTokens = rows.reduce((acc, r) => acc + (r.tokens_in ?? 0) + (r.tokens_out ?? 0), 0);
  const avgLatency = totalCalls
    ? Math.round(rows.reduce((acc, r) => acc + (r.latency_ms ?? 0), 0) / totalCalls)
    : 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <AdminPageHeader
          title="AI Usage"
          description="Monitor how the Gemini-powered assistant is being used."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Calls"
            value={totalCalls.toLocaleString()}
            icon={Zap}
            trend={22}
            hint="last 30 days"
            accent="from-blue-500 to-sky-500"
          />
          <StatCard
            title="Tokens Consumed"
            value={totalTokens.toLocaleString()}
            icon={Coins}
            hint="in + out"
            accent="from-teal-500 to-emerald-500"
            delay={0.05}
          />
          <StatCard
            title="Avg. Latency"
            value={avgLatency ? `${(avgLatency / 1000).toFixed(1)}s` : "—"}
            icon={Gauge}
            hint="per response"
            accent="from-violet-500 to-purple-500"
            delay={0.1}
          />
          <StatCard
            title="Most Used"
            value={rows[0]?.action ?? "—"}
            icon={Clock3}
            hint="recent action"
            accent="from-amber-500 to-orange-500"
            delay={0.15}
          />
        </div>

        <AiUsageTable rows={rows} />
      </div>
    </PageTransition>
  );
}
