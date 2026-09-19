"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminCreateHospital } from "@/app/actions";

export function AddHospitalDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    website: "",
    specialities: "",
    emergency: false,
    latitude: "",
    longitude: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Hospital name is required.");
      return;
    }
    const latitude = form.latitude.trim() ? Number(form.latitude) : null;
    const longitude = form.longitude.trim() ? Number(form.longitude) : null;
    if ((latitude === null) !== (longitude === null) || Number.isNaN(latitude ?? NaN) || Number.isNaN(longitude ?? NaN)) {
      toast.error("Enter both latitude and longitude (or leave both empty).");
      return;
    }
    setSaving(true);
    const result = await adminCreateHospital({
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined,
      specialities: form.specialities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      emergency: form.emergency,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not add hospital.");
      return;
    }
    toast.success("Hospital added.");
    setOpen(false);
    setForm({ name: "", address: "", city: "", state: "", phone: "", email: "", website: "", specialities: "", emergency: false, latitude: "", longitude: "" });
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add hospital
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add hospital</DialogTitle>
          <DialogDescription>Register a new partner hospital on the network.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="h-name">Hospital name *</Label>
            <Input
              id="h-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. City General Hospital"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="h-city">City</Label>
              <Input id="h-city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Bengaluru" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-state">State</Label>
              <Input id="h-state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Karnataka" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-address">Address</Label>
            <Input id="h-address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, area" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="h-latitude">Latitude</Label>
              <Input
                id="h-latitude"
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
                placeholder="e.g. 12.9716"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-longitude">Longitude</Label>
              <Input
                id="h-longitude"
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
                placeholder="e.g. 77.5946"
                inputMode="decimal"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave both empty to skip the map pin. Tip: search the hospital in Google Maps, then copy the number from its URL.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="h-phone">Phone</Label>
              <Input id="h-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-website">Website</Label>
              <Input id="h-website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-email">Email</Label>
            <Input id="h-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-specialities">Specialities (comma-separated)</Label>
            <Input
              id="h-specialities"
              value={form.specialities}
              onChange={(e) => set("specialities", e.target.value)}
              placeholder="Cardiology, Orthopedics"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.emergency} onCheckedChange={(v) => set("emergency", v === true)} />
            Emergency / 24×7 facility
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Add hospital
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}