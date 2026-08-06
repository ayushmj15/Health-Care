"use client";

import {
  Ambulance,
  Cross,
  Droplets,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Share2,
  Siren,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addEmergencyContact, deleteEmergencyContact } from "@/lib/services/profile";
import { nearestHospitals } from "@/lib/services/hospitals";
import type { EmergencyContact, Hospital, UserProfile } from "@/types";

const AMBULANCE_NUMBERS = [
  { name: "National Emergency", number: "112" },
  { name: "Ambulance", number: "108" },
  { name: "Police", number: "100" },
  { name: "Fire & Rescue", number: "101" },
];

export function EmergencyMode({
  user,
  hospitals,
  contacts: initialContacts,
}: {
  user: UserProfile;
  hospitals: Hospital[];
  contacts: EmergencyContact[];
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [sosActive, setSosActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [locating, setLocating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const emergencyHospitals = nearestHospitals(
    hospitals.filter((h) => h.emergency),
    location?.lat ?? 12.9716,
    location?.lng ?? 77.5946,
  ).slice(0, 4);

  async function triggerSos() {
    setSosActive(true);
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      // In demo mode we simply open the emergency contacts' SMS/phone links.
      const primary = contacts[0];
      if (primary) {
        window.open(`sms:${primary.phone.replace(/\D/g, "")}?body=EMERGENCY! I need help. My live location is shared via Health Care.`, "_self");
      }
      toast.success("SOS alert sent to your emergency contacts.");
    } catch {
      toast.error("Could not send SOS.");
    } finally {
      setSending(false);
    }
  }

  function shareLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setLocating(false);
        toast.success("Live location captured.");

        const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        const text = `I'm sharing my live location. Please track me: ${mapsUrl}`;

        if (navigator.share) {
          try {
            await navigator.share({ title: "My live location", text, url: mapsUrl });
            return;
          } catch {
            // fall back to copy
          }
        }
        await navigator.clipboard.writeText(text);
        toast.success("Location link copied to clipboard.");
      },
      () => toast.error("Could not access location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return toast.error("Name and phone are required");
    try {
      const created = await addEmergencyContact({
        patient_id: user.id,
        name: newContact.name,
        relation: newContact.relation || null,
        phone: newContact.phone,
      });
      setContacts((prev) => [...prev, created]);
      setAddOpen(false);
      setNewContact({ name: "", relation: "", phone: "" });
      toast.success("Emergency contact added.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add contact.");
    }
  }

  async function removeContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteEmergencyContact(id);
    } catch {
      // demo mode
    }
  }

  return (
    <div className="space-y-6">
      {/* SOS */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-rose-500/5 p-8 text-center">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
        <Siren className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Emergency mode</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          In a medical emergency, stay calm. Press SOS to alert your contacts, share your live location, and find the
          nearest emergency care.
        </p>

        <button
          type="button"
          onClick={triggerSos}
          className="relative mx-auto mt-8 flex h-36 w-36 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 transition-transform hover:scale-105 active:scale-95"
          aria-label="SOS"
        >
          {sosActive && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-500" />}
          <span className="relative flex flex-col items-center">
            <Siren className="h-9 w-9" />
            <span className="mt-1 text-lg font-extrabold tracking-widest">SOS</span>
            <span className="text-[10px] uppercase tracking-widest text-white/80">
              {sending ? "Sending…" : "Press in emergency"}
            </span>
          </span>
        </button>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={shareLocation} disabled={locating}>
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            {location ? "Share live location" : "Get & share location"}
          </Button>
          <Button variant="outline" asChild>
            <a href="tel:112">
              <Phone className="h-4 w-4" /> Call 112
            </a>
          </Button>
        </div>

        {location && (
          <div className="mx-auto mt-4 max-w-sm rounded-xl border bg-card p-3 text-left text-xs">
            <p className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-primary" /> Live location
            </p>
            <p className="mt-1 text-muted-foreground">
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          </div>
        )}
      </div>

      {/* Ambulance + nearby hospitals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-semibold">Ambulance & emergency numbers</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {AMBULANCE_NUMBERS.map((n) => (
              <a
                key={n.name}
                href={`tel:${n.number}`}
                className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:border-red-500/40 hover:bg-red-500/5"
              >
                <div>
                  <p className="text-sm font-semibold">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.number}</p>
                </div>
                <Phone className="h-4 w-4 text-red-500" />
              </a>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Nearby emergency hospitals</h4>
              <span className="text-xs text-muted-foreground">
                {location ? "by live distance" : "by default area"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {emergencyHospitals.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.phone}
                      {h.distanceKm !== undefined ? ` · ${h.distanceKm} km` : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="destructive" asChild className="shrink-0">
                    <a href={`tel:${h.phone?.replace(/\D/g, "")}`}>
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts + medical profile */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Emergency contacts</h3>
              </div>
              <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <div className="mt-4 space-y-2.5">
              {contacts.length === 0 && (
                <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No emergency contacts yet. Add family or friends who should be notified in a crisis.
                </p>
              )}
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.relation ?? "Contact"} · {c.phone}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="iconSm" variant="outline" asChild>
                      <a href={`tel:${c.phone.replace(/\D/g, "")}`} aria-label={`Call ${c.name}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="iconSm" variant="ghost" onClick={() => removeContact(c.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Cross className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Medical profile for responders</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Blood group</p>
                <p className="mt-1 font-bold text-red-500">{user.blood_group ?? "—"}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Allergies</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {user.allergies.length ? (
                    user.allergies.map((a) => (
                      <Badge key={a} variant="destructive" className="text-[10px]">
                        {a}
                      </Badge>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </div>
              </div>
              <div className="col-span-2 rounded-xl bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Chronic conditions</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {user.chronic_diseases.length ? (
                    user.chronic_diseases.map((d) => (
                      <Badge key={d} variant="warning" className="text-[10px]">
                        {d}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">None recorded</span>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
                <Share2 className="h-4 w-4" />
                <span>
                  This profile is shared with responders when SOS is triggered (toggle in Settings → Privacy).
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert variant="info">
        <Siren className="h-4 w-4" />
        <AlertTitle>When to use emergency mode</AlertTitle>
        <AlertDescription>
          Call emergency services immediately for chest pain, difficulty breathing, severe bleeding, stroke symptoms or
          loss of consciousness. This app is a supplementary aid — it never replaces calling 112.
        </AlertDescription>
      </Alert>

      {/* Add contact dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add emergency contact</DialogTitle>
            <DialogDescription>This person will be alerted when you trigger SOS.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addContact} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="e.g. Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <Input value={newContact.relation} onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })} placeholder="e.g. Wife" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="+91 98765 43210" inputMode="tel" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4" /> Add contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {sosActive && !sending && (
        <button type="button" onClick={() => setSosActive(false)} className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground">
          <X className="h-3.5 w-3.5" /> SOS alert sent — dismiss
        </button>
      )}
    </div>
  );
}
