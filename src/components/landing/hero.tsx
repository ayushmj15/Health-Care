"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarHeart, HeartPulse, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AuthAwareButton } from "@/components/landing/auth-aware-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const floatingCards = [
  {
    icon: Bot,
    title: "AI Assistant",
    desc: "Answers in seconds",
    className: "top-16 -left-8 md:-left-16",
    delay: 0.2,
  },
  {
    icon: CalendarHeart,
    title: "Appointment booked",
    desc: "Dr. Mehta · 10:30 AM",
    className: "top-1/2 -right-6 md:-right-12",
    delay: 0.35,
  },
  {
    icon: ShieldCheck,
    title: "Records secured",
    desc: "256-bit encrypted",
    className: "bottom-10 -left-6 md:-left-10",
    delay: 0.5,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[400px] w-[500px] rounded-full bg-teal/15 blur-[120px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              <HeartPulse className="h-3.5 w-3.5" />
              AI-powered healthcare, made accessible
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your health, <span className="text-gradient">intelligently</span> cared for
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Book appointments, store medical records, get AI health guidance and never miss a dose —
            all in one beautifully simple platform. Care that&apos;s always a tap away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <AuthAwareButton href="/signup" loggedInLabel="Open dashboard" size="xl" className="w-full sm:w-auto">
              Get started free <ArrowRight className="ml-1 h-4 w-4" />
            </AuthAwareButton>
            <Button size="xl" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">Explore the demo</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            No credit card required · Free forever for patients
          </motion.p>
        </div>

        {/* Floating preview cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="relative mx-auto mt-20 max-w-3xl"
        >
          <div className="glass-strong rounded-3xl border p-2">
            <div className="rounded-2xl bg-gradient-to-br from-primary via-sky-500 to-teal p-[1px]">
              <div className="rounded-2xl bg-background/95 p-4 backdrop-blur">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Appointments", icon: "📅" },
                    { label: "Health records", icon: "📄" },
                    { label: "Reminders", icon: "💊" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border bg-muted/30 p-4 text-left">
                      <p className="text-xl">{s.icon}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {floatingCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay + 0.5, duration: 0.6 }}
              className={cn(
                "glass-strong absolute hidden items-start gap-3 rounded-2xl border p-3 shadow-xl sm:flex",
                card.className,
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{card.title}</p>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
