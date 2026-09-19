"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
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
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  const hasKey = isMapsConfigured();

  const renderMarkers = useCallback(
    (map: google.maps.Map) => {
      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) infoWindowRef.current.close();

      const valid = hospitals.filter((h) => h.latitude && h.longitude);
      const bounds = new google.maps.LatLngBounds();

      // Add user location marker
      if (center) {
        if (userMarkerRef.current) userMarkerRef.current.setMap(null);
        userMarkerRef.current = new google.maps.Marker({
          position: center,
          map,
          title: "Your location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 999,
        });
        bounds.extend(center);
      }

      valid.forEach((h) => {
        const pos = { lat: h.latitude!, lng: h.longitude! };
        const isSelected = h.id === selectedId;
        const marker = new google.maps.Marker({
          position: pos,
          map,
          title: h.name,
          icon: {
            url: h.emergency
              ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(isSelected ? 44 : 36, isSelected ? 44 : 36),
          },
          animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
          zIndex: isSelected ? 100 : 1,
        });

        const distText = h.distanceKm !== undefined ? `<br/><span style="color:#2563eb;font-weight:600;font-size:12px">📍 ${h.distanceKm} km away</span>` : "";
        const info = new google.maps.InfoWindow({
          content: `<div style="padding:8px 4px;font-family:system-ui,sans-serif;max-width:220px">
          <strong style="font-size:14px">${h.name}</strong><br/>
          <span style="color:#64748b;font-size:12px">${h.address ?? ""}, ${h.city ?? ""}</span><br/>
          ${h.rating ? `<span style="font-size:12px">⭐ ${h.rating} (${h.reviews_count} reviews)</span>` : ""}
          ${distText}
          <br/><a href="https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}&destination_place_id=&travelmode=driving" target="_blank" rel="noopener" style="color:#2563eb;font-size:12px;font-weight:600;text-decoration:none">Get Directions →</a>
        </div>`,
        });

        marker.addListener("click", () => {
          if (infoWindowRef.current) infoWindowRef.current.close();
          infoWindowRef.current = info;
          info.open({ anchor: marker, map });
          onSelect?.(h);
        });

        // Auto-open info window for selected hospital
        if (isSelected) {
          setTimeout(() => {
            infoWindowRef.current = info;
            info.open({ anchor: marker, map });
          }, 300);
        }

        markersRef.current.push(marker);
        bounds.extend(pos);
      });

      if (valid.length > 1 || (valid.length >= 1 && center)) {
        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      } else if (valid.length === 1) {
        map.setCenter({ lat: valid[0].latitude!, lng: valid[0].longitude! });
        map.setZoom(14);
      }
    },
    [hospitals, center, selectedId, onSelect],
  );

  // Initialize the map once
  useEffect(() => {
    if (!hasKey || !mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const loader = new Loader({ apiKey, version: "weekly", libraries: ["places"] });

    let cancelled = false;

    loader.load().then(() => {
      if (cancelled || !mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: center ?? DEFAULT_CENTER,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });
      googleMapRef.current = map;
      renderMarkers(map);
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey]);

  // Re-render markers and re-center when hospitals, center, or selection changes
  useEffect(() => {
    if (!googleMapRef.current) return;
    renderMarkers(googleMapRef.current);
  }, [renderMarkers]);

  // Re-center the map when user location changes
  useEffect(() => {
    if (!googleMapRef.current || !center) return;
    googleMapRef.current.panTo(center);
    googleMapRef.current.setZoom(12);
  }, [center]);

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
