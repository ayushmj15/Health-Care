"use client";

import { Activity, CheckCircle2, Download, Share, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type PromptState = "checking" | "ready" | "unavailable";

const IOS_UA = /iphone|ipad|ipod/i;
const ANDROID_UA = /android/i;

export function InstallLanding() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [promptState, setPromptState] = useState<PromptState>("checking");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    function onPrompt(event: Event) {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setPromptState("ready");
    }

    function onInstalled() {
      setInstalled(true);
      setPromptState("unavailable");
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const timeout = setTimeout(() => {
      if (isStandalone) {
        setInstalled(true);
        setPromptState("unavailable");
      } else if (!deferred.current) {
        setPromptState("unavailable");
      }
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(timeout);
    };
  }, []);

  async function handleInstall() {
    const prompt = deferred.current;
    if (!prompt) return;
    await prompt.prompt();
    try {
      await prompt.userChoice;
    } catch {
      // user dismissed or flow cancelled
    }
    deferred.current = null;
  }

  const isIos = IOS_UA.test(navigator.userAgent);
  const isAndroid = ANDROID_UA.test(navigator.userAgent);

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-primary/10 via-background to-background">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-teal text-white shadow-xl shadow-primary/30">
            <Activity className="h-10 w-10" strokeWidth={2.5} />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            {APP_NAME.split(" ")[0]}{" "}
            <span className="text-gradient">{APP_NAME.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Get instant access to appointments, health records, medicine reminders and 24/7 AI
            assistance right from your home screen.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {installed ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <CheckCircle2 className="h-10 w-10" />
              <p className="text-sm font-medium">Health Care is installed on your phone</p>
              <p className="text-xs text-muted-foreground">Open it anytime from your home screen.</p>
              <Button variant="outline" className="mt-2" size="lg" asChild>
                <Link href="/dashboard">Open Health Care</Link>
              </Button>
            </div>
          ) : promptState === "ready" ? (
            <Button variant="gradient" size="xl" className="gap-4 rounded-full px-10 text-base" onClick={handleInstall}>
              <Download className="h-6 w-6" strokeWidth={2.5} />
              Install Now
            </Button>
          ) : promptState === "checking" ? (
            <div className="flex min-h-14 items-center px-10 text-sm text-muted-foreground">
              <Smartphone className="mr-2 h-5 w-5 animate-pulse" />
              Checking for install support…
            </div>
          ) : (
            <div className="w-full max-w-xs">
              <p className="flex items-center justify-center gap-2 text-sm font-medium">
                <Smartphone className="h-5 w-5 text-primary" />
                {installed ? "App installed" : "Install free"}
              </p>
              <div className="mt-2 rounded-xl border bg-background/60 p-3 text-left text-xs text-muted-foreground">
                {isIos ? (
                  <>
                    <p className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
                      <Share className="h-3.5 w-3.5" /> How to add on iPhone / iPad
                    </p>
                    <ol className="list-decimal space-y-1 pl-4">
                      <li>Tap the Share button in Safari</li>
                      <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                      <li>Tap <strong>Add</strong> — Health Care appears on your Home Screen</li>
                    </ol>
                  </>
                ) : (
                  <>
                    <p className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
                      <Smartphone className="h-3.5 w-3.5" /> {isAndroid ? "Open this page in Chrome" : "How to install"}
                    </p>
                    <ol className="list-decimal space-y-1 pl-4">
                      <li>Open this page in the Chrome browser</li>
                      <li>Tap the Chrome menu (⋮) → <strong>&quot;Install app&quot;</strong></li>
                      <li>Health Care is added to your Home Screen</li>
                    </ol>
                  </>
                )}
              </div>
            </div>
          )}

          <Link
            href="/?app=1"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Skip for now — use it as a website
          </Link>
        </div>
      </main>

      <footer className="border-t bg-background/40 py-5 text-center text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}