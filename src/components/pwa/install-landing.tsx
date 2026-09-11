"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Download,
  Lock,
  Share,
  Smartphone,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
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

const TRUST_BADGES = [
  { icon: Lock, label: "End-to-end encrypted" },
  { icon: Zap, label: "Instant & free" },
  { icon: WifiOff, label: "Works offline" },
];

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

  const isIos = typeof navigator !== "undefined" && IOS_UA.test(navigator.userAgent);
  const isAndroid = typeof navigator !== "undefined" && ANDROID_UA.test(navigator.userAgent);

  return (
    <div className="flex min-h-dvh flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(217 91% 55% / 0.12), hsl(var(--background)), hsl(178 100% 34% / 0.1))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 8s ease infinite",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute -top-32 -left-20 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] animate-orb-float-1" />
        <div className="absolute -bottom-32 -right-20 h-[350px] w-[350px] rounded-full bg-teal/10 blur-[100px] animate-orb-float-2" />
        <div className="absolute top-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-violet-500/8 blur-[80px] animate-orb-float-1" />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center">
        {/* App icon with pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-teal opacity-30 blur-xl animate-pulse" />
            <span className="absolute -inset-3 rounded-[2rem] border-2 border-primary/20 animate-pulse-ring-expand" />
            <motion.span
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-teal text-white shadow-xl shadow-primary/30"
              whileHover={{ rotateY: 15 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Activity className="h-12 w-12" strokeWidth={2.5} />
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="text-3xl font-bold tracking-tight"
          >
            {APP_NAME.split(" ")[0]}{" "}
            <span className="text-gradient">{APP_NAME.split(" ").slice(1).join(" ")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-sm text-sm leading-relaxed text-muted-foreground"
          >
            Get instant access to appointments, health records, medicine reminders and 24/7 AI
            assistance right from your home screen.
          </motion.p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200, damping: 18 }}
              className="flex items-center gap-1.5 rounded-full border bg-card/60 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
            >
              <badge.icon className="h-3.5 w-3.5 text-primary" />
              {badge.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Install action area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <AnimatePresence mode="wait">
            {installed ? (
              <motion.div
                key="installed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 text-primary"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="h-12 w-12" />
                </motion.div>
                <p className="text-sm font-medium">Health Care is installed on your phone</p>
                <p className="text-xs text-muted-foreground">Open it anytime from your home screen.</p>
                <Button variant="outline" className="mt-2" size="lg" asChild>
                  <Link href="/dashboard">Open Health Care</Link>
                </Button>
              </motion.div>
            ) : promptState === "ready" ? (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  variant="gradient"
                  size="xl"
                  className="gap-4 rounded-full px-10 text-base shadow-glow-primary animate-glow-pulse"
                  onClick={handleInstall}
                >
                  <Download className="h-6 w-6" strokeWidth={2.5} />
                  Install Now
                </Button>
              </motion.div>
            ) : promptState === "checking" ? (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-14 items-center px-10 text-sm text-muted-foreground"
              >
                <Smartphone className="mr-2 h-5 w-5 animate-pulse" />
                Checking for install support…
              </motion.div>
            ) : (
              <motion.div
                key="manual"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xs"
              >
                <p className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Install free
                </p>
                <div className="mt-3 rounded-2xl border bg-card/60 backdrop-blur p-4 text-left text-xs text-muted-foreground shadow-3d">
                  {isIos ? (
                    <>
                      <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
                        <Share className="h-3.5 w-3.5" /> How to add on iPhone / iPad
                      </p>
                      <ol className="list-decimal space-y-2 pl-4">
                        <li>Tap the <strong>Share</strong> button in Safari</li>
                        <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                        <li>Tap <strong>Add</strong> — Health Care appears on your Home Screen</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
                        <Smartphone className="h-3.5 w-3.5" /> {isAndroid ? "Open this page in Chrome" : "How to install"}
                      </p>
                      <ol className="list-decimal space-y-2 pl-4">
                        <li>Open this page in the Chrome browser</li>
                        <li>Tap the Chrome menu (⋮) → <strong>&quot;Install app&quot;</strong></li>
                        <li>Health Care is added to your Home Screen</li>
                      </ol>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/?app=1"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline transition-colors hover:text-foreground"
          >
            Skip for now — use it as a website
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-sm"
        >
          {["📅 Appointments", "💊 Reminders", "🤖 AI Assistant", "🗺️ Hospitals", "🚨 Emergency"].map(
            (pill, i) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                className="rounded-full border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {pill}
              </motion.span>
            )
          )}
        </motion.div>
      </main>

      <footer className="border-t bg-card/40 backdrop-blur py-5 text-center text-xs text-muted-foreground pb-safe">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}