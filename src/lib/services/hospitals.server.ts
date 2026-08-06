import type { Doctor, Hospital } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEMO_DOCTORS, DEMO_HOSPITALS } from "@/lib/demo-data";
import { withDistance } from "@/lib/services/hospitals";

// ============================================================================
// Server-only read helpers for hospitals & doctors.
// Import from Server Components / Server Actions only.
// ============================================================================

interface HospitalFilters {
  search?: string;
  city?: string;
  speciality?: string;
  emergencyOnly?: boolean;
  lat?: number;
  lng?: number;
}

/** Fetch hospitals, optionally filtered. Returns demo data when Supabase is not configured. */
export async function getHospitals(filters: HospitalFilters = {}): Promise<Hospital[]> {
  if (!isSupabaseConfigured()) {
    return filterDemoHospitals(filters);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("hospitals").select("*").eq("is_active", true);

    if (filters.search) query = query.ilike("name", `%${filters.search}%`);
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.speciality) query = query.contains("specialities", [filters.speciality]);
    if (filters.emergencyOnly) query = query.eq("emergency", true);

    const { data, error } = await query.order("rating", { ascending: false }).limit(50);
    if (error) throw error;
    return (data ?? []) as Hospital[];
  } catch {
    return filterDemoHospitals(filters);
  }
}

/** All distinct hospital cities for the filter dropdown. */
export async function getHospitalCities(): Promise<string[]> {
  const hospitals = await getHospitals();
  return [...new Set(hospitals.map((h) => h.city).filter(Boolean))] as string[];
}

/** Fetch doctors, optionally for a specific hospital / speciality. */
export async function getDoctors(filters: { hospitalId?: string; speciality?: string; search?: string } = {}): Promise<Doctor[]> {
  if (!isSupabaseConfigured()) {
    return filterDemoDoctors(filters);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("doctors").select("*, hospital:hospitals(*)").eq("is_active", true);

    if (filters.hospitalId) query = query.eq("hospital_id", filters.hospitalId);
    if (filters.speciality) query = query.eq("speciality", filters.speciality);
    if (filters.search) query = query.ilike("name", `%${filters.search}%`);

    const { data, error } = await query.order("rating", { ascending: false }).limit(100);
    if (error) throw error;
    return (data ?? []) as Doctor[];
  } catch {
    return filterDemoDoctors(filters);
  }
}

/** List doctors by speciality name (used by appointment booking). */
export async function getDoctorsBySpeciality(speciality: string) {
  return getDoctors({ speciality });
}

function filterDemoHospitals(filters: HospitalFilters): Hospital[] {
  let result = [...DEMO_HOSPITALS];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((h) => h.name.toLowerCase().includes(s) || h.city?.toLowerCase().includes(s) || h.specialities.some((x) => x.toLowerCase().includes(s)));
  }
  if (filters.city) result = result.filter((h) => h.city?.toLowerCase().includes(filters.city!.toLowerCase()));
  if (filters.speciality) result = result.filter((h) => h.specialities.includes(filters.speciality!));
  if (filters.emergencyOnly) result = result.filter((h) => h.emergency);

  if (filters.lat && filters.lng) {
    result = withDistance(result, filters.lat, filters.lng).sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  }
  return result;
}

function filterDemoDoctors(filters: { hospitalId?: string; speciality?: string; search?: string }): Doctor[] {
  let result = [...DEMO_DOCTORS];
  if (filters.hospitalId) result = result.filter((d) => d.hospital_id === filters.hospitalId);
  if (filters.speciality) result = result.filter((d) => d.speciality === filters.speciality);
  if (filters.search) result = result.filter((d) => d.name.toLowerCase().includes(filters.search!.toLowerCase()));
  return result;
}
