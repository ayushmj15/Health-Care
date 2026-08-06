import { RecordsExplorer } from "@/components/records/records-explorer";
import { getReports } from "@/lib/services/records.server";
import { getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "Health Records" };

export default async function RecordsPage() {
  const profile = await getProfile();
  const userId = profile?.id ?? "demo-user";
  const reports = await getReports(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Digital health records</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload, preview, search and download your prescriptions, reports and scans — securely stored.
        </p>
      </div>
      <RecordsExplorer userId={userId} initialReports={reports} />
    </div>
  );
}
