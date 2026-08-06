"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { isMapsConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import type { Hospital } from "@/types";

interface HospitalMapProps {
  hospitals: (Hospital & { distanceKm?: number })[];
  center?: { lat: number; lng: number };
  selectedId?: string | null;
  onSelect?: (hospital: Hospital) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bengaluru

export function HospitalMap({ hospitals, center, selectedId, onSelect, className }: HospitalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const hasKey = isMapsConfigured();

  useEffect(() => {
    if (!hasKey || !mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const loader = new Loader({ apiKey, version: "weekly", libraries: ["places"] });

    let active: google.maps.Map | null = null;
    let cancelled = false;

    loader.load().then(() => {
      if (cancelled || !mapRef.current) return;
      active = new google.maps.Map(mapRef.current, {
        center: center ?? DEFAULT_CENTER,
        zoom: 11,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });
      googleMapRef.current = active;
      renderMarkers(active);
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey]);

  function renderMarkers(map: google.maps.Map) {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const valid = hospitals.filter((h) => h.latitude && h.longitude);
    const bounds = new google.maps.LatLngBounds();

    valid.forEach((h) => {
      const pos = { lat: h.latitude!, lng: h.longitude! };
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: h.name,
        icon: {
          url: h.emergency
            ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(36, 36),
        },
      });

      const info = new google.maps.InfoWindow({
        content: `<div style="padding:8px 4px;font-family:inherit">
          <strong>${h.name}</strong><br/>
          <span style="color:#64748b;font-size:12px">${h.address ?? ""}</span><br/>
          ${h.rating ? `⭐ ${h.rating} (${h.reviews_count} reviews)` : ""}
        </div>`,
      });

      marker.addListener("click", () => {
        info.open({ anchor: marker, map });
        onSelect?.(h);
      });

      markersRef.current.push(marker);
      bounds.extend(pos);
    });

    if (valid.length > 1) map.fitBounds(bounds);
    if (valid.length === 1) map.setCenter({ lat: valid[0].latitude!, lng: valid[0].longitude! });
  }

  // Re-render markers when the hospital list changes
  useEffect(() => {
    if (googleMapRef.current) renderMarkers(googleMapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitals]);

  if (!hasKey) {
    return (
      <div
        className={cn(
          "relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-teal/5",
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <MapPin className="h-12 w-12 text-primary/40" />
        <p className="mt-3 max-w-xs text-center text-sm font-medium">Interactive map placeholder</p>
        <p className="mt-1 max-w-xs px-6 text-center text-xs text-muted-foreground">
          Add a <code className="rounded bg-muted px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env.local to
          activate live Google Maps. The hospital list below works regardless.
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className={cn("h-full min-h-[320px] rounded-2xl border", className)} />;
}
