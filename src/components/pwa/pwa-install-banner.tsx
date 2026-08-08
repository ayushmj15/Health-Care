"use client";

import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Install banner shown on mobile browsers. Prompts the user to install the
 * app to their home screen so Health Care works like a native app.
 */
export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIos(ios);

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  }

  if (isStandalone || dismissed || (!deferredPrompt && !isIos)) return null;

  return (
    <div className="flex flex-col items-center gap-2 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Smartphone className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">Install Health Care as an app</p>
          <p className="text-[11px] text-muted-foreground">
            {deferredPrompt
              ? "Add it to your home screen for one-tap access — no browser needed."
              : "On iPhone: tap the Share button in Safari, then “Add to Home Screen”."}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {deferredPrompt ? (
          <Button size="sm" onClick={install}>
            <Download className="h-3.5 w-3.5" /> Install
          </Button>
        ) : (
          <span className="hidden rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground sm:block">
            Share → Add to Home Screen
          </span>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
