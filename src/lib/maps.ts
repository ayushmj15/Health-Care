/**
 * Google Maps directions/search URL for a hospital.
 * Prefers a full address so Google Maps geocodes the correct location —
 * plain lat/lng often point to a slightly wrong spot.
 */
export function hospitalDirectionsUrl(h: {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  const parts = [h.address, h.city, h.state].filter(Boolean);
  if (parts.length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts.join(", "))}`;
  }
  if (h.latitude && h.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name ?? "")}`;
}
