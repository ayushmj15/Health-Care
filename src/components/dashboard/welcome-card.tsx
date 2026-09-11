"use client";

import { motion } from "framer-motion";
import { CalendarHeart, FolderHeart, MapPin, MessageSquareHeart, Siren } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

const ACTIONS = [
  { href: "/dashboard/appointments", icon: CalendarHeart, label: "Book appointment", gradient: "from-primary to-sky-500" },
  { href: "/dashboard/hospitals", icon: MapPin, label: "Find a hospital", gradient: "from-teal to-emerald-500" },
  { href: "/dashboard/assistant", icon: MessageSquareHeart, label: "Ask the AI", gradient: "from-violet-500 to-purple-500" },
  { href: "/dashboard/records", icon: FolderHeart, label: "Upload report", gradient: "from-amber-500 to-orange-500" },
];

export function WelcomeCard({ user }: { user: UserProfile }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (user.full_name ?? "there").split(" ")[0];

  return (
    <Card className="relative overflow-hidden border-0 text-white">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          backgroundImage: "linear-gradient(135deg, hsl(217 91% 55%), hsl(199 89% 48%), hsl(178 100% 34%))",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />

      <CardContent className="relative p-6 sm:p-8">
        <p className="text-sm text-white/80">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, {firstName}{" "}
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/85">
          Here&apos;s your health at a glance. You&apos;ve got everything you need to stay on track today.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map((action, i) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link
                href={action.href}
                className={cn(
                  "group flex flex-col items-start gap-2 rounded-xl bg-white/10 p-3 backdrop-blur transition-all",
                  "hover:bg-white/20 hover:shadow-lg active:scale-[0.97]",
                )}
              >
                <motion.span
                  className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow", action.gradient)}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <action.icon className="h-5 w-5" />
                </motion.span>
                <span className="text-xs font-medium text-white">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        >
          <Link
            href="/dashboard/emergency"
            className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-500 active:scale-[0.97]"
          >
            {/* Pulsing red glow */}
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-red-300 opacity-40" />
              <Siren className="relative h-4 w-4" />
            </span>
            Emergency SOS
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  );
}
