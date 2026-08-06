import { MedicinesExplorer } from "@/components/medicines/medicines-explorer";
import { getMedicines, getReminders } from "@/lib/services/medicines.server";
import { getProfile } from "@/lib/services/profile.server";

export const metadata = { title: "Medicine Reminders" };

export default async function MedicinesPage() {
  const profile = await getProfile();
  const userId = profile?.id ?? "demo-user";
  const [medicines, reminders] = await Promise.all([getMedicines(userId), getReminders(userId)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Medicine reminders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your medication schedule and never miss a dose.
        </p>
      </div>
      <MedicinesExplorer userId={userId} initialMedicines={medicines} initialReminders={reminders} />
    </div>
  );
}
