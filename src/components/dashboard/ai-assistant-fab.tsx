"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Always-visible floating AI assistant button.
 * Hidden on the assistant page itself.
 * Positioned above the bottom tab bar on mobile.
 */
export function AiAssistantFab() {
  const pathname = usePathname();
  if (pathname === "/dashboard/assistant") return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed z-40 bottom-20 right-5 lg:bottom-5"
    >
      <Link
        href="/dashboard/assistant"
        aria-label="Chat with AI assistant"
        className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-sky-600 py-3 pl-4 pr-5 text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
      >
        {/* Breathing glow */}
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-sky-600 opacity-30 blur-lg animate-glow-pulse" />

        {/* Online indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-teal" />
        </span>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-5 w-5 shrink-0" />
        </motion.div>
        <span className="relative text-sm font-semibold">Ask AI</span>
        <span className="hidden text-xs font-medium text-white/70 transition-colors group-hover:text-white sm:block">
          Health assistant
        </span>
      </Link>
    </motion.div>
  );
}
