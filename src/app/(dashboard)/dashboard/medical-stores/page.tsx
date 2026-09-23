import { PharmacyExplorer } from "@/components/maps/pharmacy-explorer";
import { getPharmacyCities, getPharmacies } from "@/lib/services/pharmacies.server";

export const metadata = { title: "Medical Stores" };

export default async function MedicalStoresPage() {
  const [pharmacies, cities] = await Promise.all([getPharmacies(), getPharmacyCities()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Find a medical store</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter and locate nearby pharmacies and medical stores — then call or get directions in one tap.
        </p>
      </div>
      <PharmacyExplorer pharmacies={pharmacies} cities={cities} />
    </div>
  );
}