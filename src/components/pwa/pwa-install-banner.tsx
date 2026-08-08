"use client";

import { Check, Copy, Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Install popup shown at the very top of the screen when the website opens.
 * Gives the app link + an Install button. No step-by-step instructions.
 */
export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    setDismissed(sessionStorage.getItem("hc_install_banner_closed") === "1");

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem("hc_install_banner_closed", "1");
    } catch {
      // ignore
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(appUrl);
    } catch {
      // ignore
    }
    setCopied(true);
    toast.success("App link copied — open it on your phone.");
    setTimeout(() => setCopied(false), 2000);
  }

  async function installNow() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
      return;
    }
    copyLink();
  }

  if (isStandalone || dismissed) return null;

  return (
    <div className="flex flex-col items-center gap-2 border-b bg-gradient-to-r from-primary via-primary to-primary-foreground px-4 py-3 text-primary-foreground sm:flex-row sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Smartphone className="h-4 w-4" />
        </span>
        <p className="text-xs font-semibold sm:text-sm">Install Health Care app</p>
      </div>
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
        <button
          type="button"
          onClick={copyLink}
          className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-medium hover:bg-white/20"
        >
          <span className="truncate">{appUrl}</span>
          {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button size="sm" variant="secondary" onClick={installNow}>
            <Download className="h-3.5 w-3.5" /> Install
          </Button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md p-1 text-primary-foreground/80 hover:bg-white/15"
            aria-label="Dismiss install popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
