import { HospitalExplorer } from "@/components/maps/hospital-explorer";
import { getHospitalCities, getHospitals } from "@/lib/services/hospitals.server";

export const metadata = { title: "Find Hospitals" };

export default async function HospitalsPage() {
  const [hospitals, cities] = await Promise.all([getHospitals(), getHospitalCities()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Find a hospital</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter and locate nearby hospitals — then book instantly.
        </p>
      </div>
      <HospitalExplorer hospitals={hospitals} cities={cities} />
    </div>
  );
}
