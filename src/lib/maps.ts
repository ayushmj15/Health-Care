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
