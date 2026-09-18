/**
 * Build a public Jitsi Meet room URL for an appointment's video consult.
 * Room names are derived from the appointment id so both doctor and patient
 * land in the same room when opening the link.
 */
export function videoRoomUrl(appointmentId: string): string {
  const room = `HealthCare-${appointmentId.replace(/[^a-zA-Z0-9-]/g, "")}`;
  return `https://meet.jit.si/${room}`;
}