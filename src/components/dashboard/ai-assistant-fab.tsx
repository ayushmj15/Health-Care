"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Always-visible floating AI assistant button in the bottom-right corner.
 * Hidden on the assistant page itself.
 */
export function AiAssistantFab() {
  const pathname = usePathname();
  if (pathname === "/dashboard/assistant") return null;

  return (
    <Link
      href="/dashboard/assistant"
      aria-label="Chat with AI assistant"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-sky-600 py-3 pl-4 pr-5 text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
    >
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-teal" />
      </span>
      <Sparkles className="h-5 w-5 shrink-0" />
      <span className="text-sm font-semibold">Ask AI</span>
      <span className="hidden text-xs font-medium text-white/70 transition-colors group-hover:text-white sm:block">
        Health assistant
      </span>
    </Link>
  );
}
