"use client";

import { useEffect } from "react";

/**
 * Registers the service worker so the app becomes installable
 * (Chrome only fires `beforeinstallprompt` when a SW + manifest exist).
 */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // offline support is optional — never block the app
    });
  }, []);

  return null;
}
