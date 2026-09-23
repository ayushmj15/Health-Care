import type { Pharmacy } from "@/types";
import { haversineKm, round } from "@/lib/utils";

// ============================================================================
// Pure client-safe geo helpers for pharmacies/medical stores.
// Server-side pharmacy reads live in "./pharmacies.server.ts".
// ============================================================================

/** Add distance (km) to pharmacies given a user location. */
export function withPharmacyDistance(pharmacies: Pharmacy[], lat?: number, lng?: number): (Pharmacy & { distanceKm?: number })[] {
  if (!lat || !lng) return pharmacies;
  return pharmacies.map((p) =>
    p.latitude && p.longitude
      ? { ...p, distanceKm: round(haversineKm(lat, lng, p.latitude, p.longitude), 1) }
      : p,
  );
}

/** Nearest pharmacies sorted by distance. */
export function nearestPharmacies(pharmacies: Pharmacy[], lat: number, lng: number) {
  return withPharmacyDistance(pharmacies, lat, lng)
    .filter((p) => p.latitude && p.longitude)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}