"use client";

import { Crosshair, Loader2, MapPin, Navigation, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { HospitalCard } from "@/components/maps/hospital-card";
import { HospitalMap } from "@/components/maps/hospital-map";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SPECIALITIES } from "@/lib/constants";
import { nearestHospitals, withDistance } from "@/lib/services/hospitals";
import type { Hospital } from "@/types";

export function HospitalExplorer({ hospitals, cities }: { hospitals: Hospital[]; cities: string[] }) {
  const [search, setSearch] = useState("");
  const [speciality, setSpeciality] = useState("all");
  const [city, setCity] = useState("all");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [selected, setSelected] = useState<Hospital | null>(null);

  function locateMe() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationDenied(false);
        setLocating(false);
        toast.success("Location found — hospitals sorted by distance from you.");
      },
      () => {
        setLocationDenied(true);
        setLocating(false);
        toast.error("Could not access your location. Check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  useEffect(() => {
    locateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = [...hospitals];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q) ||
          h.specialities.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (speciality !== "all") list = list.filter((h) => h.specialities.includes(speciality));
    if (city !== "all") list = list.filter((h) => h.city === city);
    if (emergencyOnly) list = list.filter((h) => h.emergency);

    if (location) {
      return nearestHospitals(list, location.lat, location.lng);
    }
    return withDistance(list);
  }, [hospitals, search, speciality, city, emergencyOnly, location]);

  const mapCenter = useMemo(() => {
    if (location) return location;
    const first = filtered.find((h) => h.latitude && h.longitude);
    return first?.latitude && first?.longitude
      ? { lat: first.latitude, lng: first.longitude }
      : undefined;
  }, [location, filtered]);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, specialities or cities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={speciality} onValueChange={setSpeciality}>
          <SelectTrigger>
            <SelectValue placeholder="Speciality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialities</SelectItem>
            {SPECIALITIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Switch id="emergency" checked={emergencyOnly} onCheckedChange={setEmergencyOnly} />
            <Label htmlFor="emergency" className="flex items-center gap-1.5 text-sm font-medium">
              <Siren className="h-4 w-4 text-red-500" /> Emergency only
            </Label>
          </div>
        </div>
        <Button variant="outline" onClick={locateMe} disabled={locating} className="sm:col-span-2 lg:col-span-1">
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          {locating ? "Finding location…" : location ? "Re-locate me" : "Use my location"}
        </Button>
      </div>

      {locationDenied && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-400">
          Location access is off — hospitals are shown in default order. Allow location in your browser to see the
          nearest hospitals first.
        </p>
      )}
      {location && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Navigation className="h-3.5 w-3.5 text-primary" />
          Showing hospitals sorted by distance from your current location.
        </p>
      )}

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border">
        <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2.5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Navigation className="h-4 w-4 text-primary" />
            {location ? "Live locations" : "Nearby hospitals"}
          </p>
          <span className="text-xs text-muted-foreground">{filtered.length} hospitals found</span>
        </div>
        <HospitalMap hospitals={filtered} center={mapCenter} selectedId={selected?.id} onSelect={setSelected} className="h-[380px]" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No hospitals match your filters"
          description="Try clearing the search or filters, or moving to a nearby city."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setSpeciality("all");
                setCity("all");
                setEmergencyOnly(false);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h) => (
            <HospitalCard key={h.id} hospital={h} selected={selected?.id === h.id} onSelect={setSelected} />
          ))}
        </div>
      )}
    </div>
  );
}
