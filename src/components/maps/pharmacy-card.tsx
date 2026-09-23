"use client";

import { Clock, ExternalLink, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directionsUrl, whatsappUrl } from "@/lib/maps";
import type { Pharmacy } from "@/types";

export function PharmacyCard({ pharmacy, selected, onSelect }: { pharmacy: Pharmacy & { distanceKm?: number }; selected?: boolean; onSelect?: (p: Pharmacy) => void }) {
  const mapUrl = directionsUrl(pharmacy);
  return (
    <div
      className={`rounded-2xl border bg-card p-4 transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-2xl">💊</span>
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onSelect?.(pharmacy)}
            className="text-left text-sm font-semibold hover:underline"
          >
            {pharmacy.name}
          </button>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {pharmacy.address}, {pharmacy.city}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {pharmacy.rating}
            </span>
            <span className="text-xs text-muted-foreground">({pharmacy.reviews_count})</span>
            {pharmacy.distanceKm !== undefined && (
              <Badge variant="secondary">{pharmacy.distanceKm} km away</Badge>
            )}
            {pharmacy.open_24_hours && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <Clock className="h-3 w-3" /> Open 24/7
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pharmacy.services.slice(0, 4).map((s) => (
          <Badge key={s} variant="ghost" className="text-[11px]">
            {s}
          </Badge>
        ))}
        {pharmacy.services.length > 4 && (
          <Badge variant="ghost" className="text-[11px]">
            +{pharmacy.services.length - 4}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <Phone className="h-3 w-3 shrink-0" />
          {pharmacy.phone ? (
            <a href={`tel:${pharmacy.phone.replace(/\D/g, "")}`} className="truncate hover:text-foreground hover:underline">
              {pharmacy.phone}
            </a>
          ) : (
            "No phone"
          )}
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t pt-2.5">
        {pharmacy.phone && (
          <Button size="sm" variant="outline" asChild className="flex-1 text-emerald-600 hover:text-emerald-600">
            <a
              href={whatsappUrl(pharmacy.phone, `Hi, I'd like to know about medicines available at ${pharmacy.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" asChild className="flex-1">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5" /> Directions
          </a>
        </Button>
      </div>
    </div>
  );
}