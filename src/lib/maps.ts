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
  // Use coordinates with the hospital name so Google Maps shows the exact pin
  // AND labels it correctly. The query param helps Google resolve the place.
  if (h.latitude && h.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}&travelmode=driving`;
  }
  // Fallback: full text address
  const parts = [h.name, h.address, h.city, h.state].filter(Boolean);
  if (parts.length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts.join(", "))}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name ?? "")}`;
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
