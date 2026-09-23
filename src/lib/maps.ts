/**
 * Google Maps directions URL for a place or hospital.
 * Prefers searching by name and address so Google Maps resolves the correct
 * POI rather than a raw coordinate which can reverse-geocode to a nearby shop.
 */
export function directionsUrl(p: {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  // Prefer searching by name and address so Google Maps resolves the correct POI
  // rather than a raw coordinate which can reverse-geocode to a nearby random shop.
  const parts = [p.name, p.address, p.city, p.state].filter(Boolean);
  if (parts.length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts.join(", "))}`;
  }
  if (p.latitude && p.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
  }
  return `https://www.google.com/maps/dir/?api=1`;
}

/**
 * Google Maps link to view a place on the map (not directions).
 */
export function hospitalMapUrl(h: {
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  if (h.latitude && h.longitude) {
    const q = encodeURIComponent(h.name ?? "Place");
    return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=&center=${h.latitude},${h.longitude}&zoom=17`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name ?? "")}`;
}

/** Google Maps directions/search URL for a hospital. */
export function hospitalDirectionsUrl(h: Parameters<typeof directionsUrl>[0]): string {
  return directionsUrl(h);
}

/**
 * WhatsApp chat link for a phone number with an optional pre-filled message.
 * Numbers are stripped to digits so formatted Indian numbers (e.g. "+91 98450 12345") work directly.
 */
export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "https://wa.me/";
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}