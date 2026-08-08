"use client";

import { Download, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Visible "Install app" button.
 * - Android/Chrome/Edge: fires the native install prompt (beforeinstallprompt).
 * - iOS Safari: shows a short "Share → Add to Home Screen" guide.
 * - Hidden once the app is already running from the home screen.
 */
export function InstallAppButton({
  label = "Install app",
  ...props
}: ButtonProps & { label?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [supported, setSupported] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

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
    if (ios) setSupported(true);

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setSupported(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
      return;
    }
    if (isIos) setShowIosHelp(true);
  }

  if (isStandalone || !supported) return null;

  return (
    <>
      <Button {...props} onClick={install} aria-label={label}>
        {deferredPrompt ? <Download className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
        {label}
      </Button>

      <Dialog open={showIosHelp} onOpenChange={setShowIosHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Health Care on your phone</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Health Care works like a native app once it&apos;s on your home screen — one tap to open, no browser
                  needed.
                </p>
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                  <li>Tap the <strong>Share</strong> button in Safari.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> — done!</li>
                </ol>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full" onClick={() => setShowIosHelp(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
