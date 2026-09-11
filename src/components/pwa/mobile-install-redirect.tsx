"use client";

import { useEffect } from "react";

const MOBILE_UA =
  /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|BlackBerry/i;

/**
 * Redirects phone users (browsing, not installed as a PWA) from the
 * marketing homepage to the /install screen, so they can add the app
 * to their home screen. Desktop and installed-PWA users are untouched.
 */
export function MobileInstallRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as Navigator & { standalone?: boolean }).standalone) return;
    if (!MOBILE_UA.test(navigator.userAgent)) return;
    if (new URLSearchParams(window.location.search).has("app")) return;

    window.location.replace("/install");
  }, []);

  return null;
}