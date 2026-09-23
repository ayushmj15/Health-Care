"use client";

import { Clock, Crosshair, Loader2, MapPin, Navigation, Pill } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PharmacyCard } from "@/components/maps/pharmacy-card";
import { PharmacyMap } from "@/components/maps/pharmacy-map";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { nearestPharmacies, withPharmacyDistance } from "@/lib/services/pharmacies";
import type { Pharmacy } from "@/types";

export function PharmacyExplorer({ pharmacies, cities }: { pharmacies: Pharmacy[]; cities: string[] }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [openNow, setOpenNow] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [selected, setSelected] = useState<Pharmacy | null>(null);

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
        toast.success("Location found — medical stores sorted by distance from you.");
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
    let list = [...pharmacies];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.services.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (city !== "all") list = list.filter((p) => p.city === city);
    if (openNow) list = list.filter((p) => p.open_24_hours);

    if (location) {
      return nearestPharmacies(list, location.lat, location.lng);
    }
    return withPharmacyDistance(list);
  }, [pharmacies, search, city, openNow, location]);

  const mapCenter = useMemo(() => {
    if (location) return location;
    const first = filtered.find((p) => p.latitude && p.longitude);
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
            placeholder="Search medical stores or cities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
            <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
            <Label htmlFor="open-now" className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-4 w-4 text-emerald-500" /> Open 24/7
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
          Location access is off — medical stores are shown in default order. Allow location in your browser to see the
          nearest stores first.
        </p>
      )}
      {location && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Navigation className="h-3.5 w-3.5 text-primary" />
          Showing medical stores sorted by distance from your current location.
        </p>
      )}

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border">
        <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2.5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Pill className="h-4 w-4 text-primary" />
            {location ? "Live locations" : "Nearby medical stores"}
          </p>
          <span className="text-xs text-muted-foreground">{filtered.length} stores found</span>
        </div>
        <PharmacyMap pharmacies={filtered} center={mapCenter} selectedId={selected?.id} onSelect={setSelected} className="h-[380px]" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No medical stores match your filters"
          description="Try clearing the search or filters, or moving to a nearby city."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCity("all");
                setOpenNow(false);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PharmacyCard key={p.id} pharmacy={p} selected={selected?.id === p.id} onSelect={setSelected} />
          ))}
        </div>
      )}
    </div>
  );
}