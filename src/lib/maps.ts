/**
 * Google Maps directions URL for a hospital.
 * Uses coordinates for precise pin + hospital name for context.
 */
export function hospitalDirectionsUrl(h: {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  // Prefer searching by name and address so Google Maps resolves the correct POI
  // rather than a raw coordinate which can reverse-geocode to a nearby random shop.
  const parts = [h.name, h.address, h.city, h.state].filter(Boolean);
  if (parts.length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts.join(", "))}`;
  }
  if (h.latitude && h.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`;
  }
  return `https://www.google.com/maps/dir/?api=1`;
}

/**
 * Google Maps link to view a hospital on the map (not directions).
 */
export function hospitalMapUrl(h: {
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  if (h.latitude && h.longitude) {
    const q = encodeURIComponent(h.name ?? "Hospital");
    return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=&center=${h.latitude},${h.longitude}&zoom=17`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name ?? "")}`;
}

/**
 * WhatsApp chat link for a phone number with an optional pre-filled message.
 */
export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "https://wa.me/";
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
