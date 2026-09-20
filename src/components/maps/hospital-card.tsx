"use client";

import Link from "next/link";
import { toast } from "sonner";
import { CalendarPlus, ExternalLink, MapPin, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hospitalDirectionsUrl, whatsappUrl } from "@/lib/maps";
import type { Hospital } from "@/types";

export function HospitalCard({ hospital, selected, onSelect }: { hospital: Hospital & { distanceKm?: number }; selected?: boolean; onSelect?: (h: Hospital) => void }) {
  const directionsUrl = hospitalDirectionsUrl(hospital);
  return (
    <div
      className={`rounded-2xl border bg-card p-3 sm:p-4 transition-all hover:shadow-md active:scale-[0.99] ${
        selected ? "ring-2 ring-primary/50 shadow-md" : ""
      }`}
      onClick={() => onSelect?.(hospital)}
    >
      {/* Header: image + info */}
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
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
            <span className="absolute left-0.5 top-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              ER
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">
            {hospital.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {hospital.address}, {hospital.city}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hospital.rating}
            </span>
            <span className="text-[11px] text-muted-foreground">({hospital.reviews_count})</span>
            {hospital.distanceKm !== undefined && (
              <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                {hospital.distanceKm} km
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Specialities */}
      <div className="mt-2.5 flex flex-wrap gap-1">
        {hospital.specialities.slice(0, 3).map((s) => (
          <Badge key={s} variant="ghost" className="text-[10px] px-1.5 py-0">
            {s}
          </Badge>
        ))}
        {hospital.specialities.length > 3 && (
          <Badge variant="ghost" className="text-[10px] px-1.5 py-0">
            +{hospital.specialities.length - 3}
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 border-t pt-3">
        <Button 
          size="sm" 
          variant={hospital.emergency ? "destructive" : "default"} 
          className="flex-1 text-xs"
          onClick={() => toast.info("Appointment system will be available soon.")}
        >
          <CalendarPlus className="h-3.5 w-3.5 mr-1" />
          Appointments Soon
        </Button>
        <Button size="sm" variant="outline" asChild className="flex-1 text-xs">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5" /> Directions
          </a>
        </Button>
        {hospital.phone && (
          <Button size="sm" variant="outline" asChild className="shrink-0" aria-label="Call hospital">
            <a href={`tel:${hospital.phone.replace(/\D/g, "")}`}>
              <Phone className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {hospital.phone && (
          <Button size="sm" variant="outline" asChild className="shrink-0 text-emerald-600 hover:text-emerald-600" aria-label="WhatsApp">
            <a
              href={whatsappUrl(hospital.phone, `Hi, I'd like to know about healthcare services at ${hospital.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
