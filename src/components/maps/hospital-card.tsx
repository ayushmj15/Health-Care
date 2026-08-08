"use client";

import { CalendarPlus, ExternalLink, MapPin, Navigation, Phone, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hospitalDirectionsUrl } from "@/lib/maps";
import type { Hospital } from "@/types";

export function HospitalCard({ hospital, selected, onSelect }: { hospital: Hospital & { distanceKm?: number }; selected?: boolean; onSelect?: (h: Hospital) => void }) {
  const directionsUrl = hospitalDirectionsUrl(hospital);
  return (
    <div
      className={`rounded-2xl border bg-card p-4 transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hospital.image_url ?? "/hospital-placeholder.svg"}
            alt={hospital.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {hospital.emergency && (
            <span className="absolute left-1 top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              ER
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onSelect?.(hospital)}
            className="text-left text-sm font-semibold hover:underline"
          >
            {hospital.name}
          </button>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {hospital.address}, {hospital.city}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hospital.rating}
            </span>
            <span className="text-xs text-muted-foreground">({hospital.reviews_count})</span>
            {hospital.distanceKm !== undefined && (
              <Badge variant="secondary">{hospital.distanceKm} km away</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {hospital.specialities.slice(0, 4).map((s) => (
          <Badge key={s} variant="ghost" className="text-[11px]">
            {s}
          </Badge>
        ))}
        {hospital.specialities.length > 4 && (
          <Badge variant="ghost" className="text-[11px]">
            +{hospital.specialities.length - 4}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          {hospital.phone}
        </span>
        <Button size="sm" variant={hospital.emergency ? "destructive" : "default"} asChild>
          <Link href={`/dashboard/appointments?hospital=${hospital.id}`}>
            <CalendarPlus className="h-3.5 w-3.5" />
            Book
          </Link>
        </Button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5">
        <Button size="sm" variant="outline" asChild className="flex-1">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5" /> Directions
          </a>
        </Button>
        {hospital.website && (
          <Button size="sm" variant="outline" asChild className="flex-1">
            <a href={hospital.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> Website
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
