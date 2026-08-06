import type { Hospital } from "@/types";
import { haversineKm, round } from "@/lib/utils";

// ============================================================================
// Pure client-safe geo helpers for hospitals.
// Server-side hospital reads live in "./hospitals.server.ts".
// ============================================================================

/** Add distance (km) to hospitals given a user location. */
export function withDistance(hospitals: Hospital[], lat?: number, lng?: number): (Hospital & { distanceKm?: number })[] {
  if (!lat || !lng) return hospitals;
  return hospitals.map((h) =>
    h.latitude && h.longitude
      ? { ...h, distanceKm: round(haversineKm(lat, lng, h.latitude, h.longitude), 1) }
      : h,
  );
}

/** Nearest hospitals sorted by distance. */
export function nearestHospitals(hospitals: Hospital[], lat: number, lng: number) {
  return withDistance(hospitals, lat, lng)
    .filter((h) => h.latitude && h.longitude)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}
