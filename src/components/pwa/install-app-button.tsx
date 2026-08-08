"use client";

import { Check, Copy, Download, Link2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Phone / install icon. Clicking it gives the app link — the user can open it
 * on their phone or install the app from there. No step-by-step instructions.
 */
export function InstallAppButton({ label = "Install app", ...props }: ButtonProps & { label?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(appUrl);
    } catch {
      // clipboard may be unavailable — copy via a temp input fallback below
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

  if (isStandalone) return null;

  return (
    <>
      <Button {...props} onClick={() => setShowDialog(true)} aria-label={label}>
        <Smartphone className="h-4 w-4" />
        {label}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" /> Install Health Care app
            </DialogTitle>
            <DialogDescription>Use this link to install the app on your phone.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2 pl-3">
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{appUrl}</span>
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Close
            </Button>
            <Button onClick={installNow}>
              <Download className="h-4 w-4" /> Install
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
