import type { Pharmacy } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_PHARMACIES } from "@/lib/demo-data";
import { withPharmacyDistance } from "@/lib/services/pharmacies";

// ============================================================================
// Server-only read helpers for pharmacies / medical stores.
// Import from Server Components / Server Actions only.
// ============================================================================

interface PharmacyFilters {
  search?: string;
  city?: string;
  openNow?: boolean;
  lat?: number;
  lng?: number;
}

/** Fetch pharmacies, optionally filtered. Returns demo data when Supabase is not configured. */
export async function getPharmacies(filters: PharmacyFilters = {}): Promise<Pharmacy[]> {
  if (!isSupabaseConfigured()) {
    return filterDemoPharmacies(filters);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("pharmacies").select("*").eq("is_active", true);

    if (filters.search) query = query.ilike("name", `%${filters.search}%`);
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.openNow) query = query.eq("open_24_hours", true);

    const { data, error } = await query.order("rating", { ascending: false }).limit(50);
    if (error) throw error;
    return (data ?? []) as Pharmacy[];
  } catch {
    return [];
  }
}

/** All distinct pharmacy cities for the filter dropdown. */
export async function getPharmacyCities(): Promise<string[]> {
  const pharmacies = await getPharmacies();
  return [...new Set(pharmacies.map((p) => p.city).filter(Boolean))] as string[];
}

function filterDemoPharmacies(filters: PharmacyFilters): Pharmacy[] {
  let result = [...DEMO_PHARMACIES];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(s) || p.city?.toLowerCase().includes(s));
  }
  if (filters.city) result = result.filter((p) => p.city?.toLowerCase().includes(filters.city!.toLowerCase()));
  if (filters.openNow) result = result.filter((p) => p.open_24_hours);

  if (filters.lat && filters.lng) {
    result = withPharmacyDistance(result, filters.lat, filters.lng).sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  }
  return result;
}