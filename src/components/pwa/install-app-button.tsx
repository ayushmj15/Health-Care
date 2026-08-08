"use client";

import { Download, MonitorSmartphone, Smartphone } from "lucide-react";
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
 * Always-visible "Install app" button.
 * - Chrome/Edge/Android: fires the native install prompt (beforeinstallprompt).
 * - iOS Safari: shows a "Share → Add to Home Screen" guide.
 * - Other browsers: shows generic add-to-home-screen instructions.
 * - Hidden only when the app is already running from the home screen.
 */
export function InstallAppButton({
  label = "Install app",
  ...props
}: ButtonProps & { label?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
      return;
    }
    setShowHelp(true);
  }

  if (isStandalone) return null;

  const isIosGuide = isIos && !deferredPrompt;

  return (
    <>
      <Button {...props} onClick={install} aria-label={label}>
        {deferredPrompt ? <Download className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
        {label}
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Health Care on your device</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                {isIosGuide ? (
                  <ol className="list-decimal space-y-1 pl-5 text-sm">
                    <li>
                      Tap the <strong>Share</strong> button in Safari.
                    </li>
                    <li>
                      Scroll down and tap <strong>Add to Home Screen</strong>.
                    </li>
                    <li>
                      Tap <strong>Add</strong> — done! It opens like a native app.
                    </li>
                  </ol>
                ) : (
                  <ol className="list-decimal space-y-1 pl-5 text-sm">
                    <li>
                      Open your browser menu (the <strong>⋮</strong> icon) or the <strong>Share</strong> button.
                    </li>
                    <li>
                      Tap <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
                    </li>
                    <li>
                      Done — it launches like a native app from your home screen.
                    </li>
                  </ol>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {!isIosGuide && (
              <Button variant="outline" onClick={() => setShowHelp(false)}>
                <MonitorSmartphone className="h-4 w-4" /> Continue in browser
              </Button>
            )}
            <Button className="w-full" onClick={() => setShowHelp(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
