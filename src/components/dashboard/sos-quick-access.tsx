import { Siren } from "lucide-react";
import Link from "next/link";

/**
 * Big centered SOS shortcut for mobile — one tap to the emergency screen
 * from the front page. Hidden on large screens where the sidebar handles it.
 */
export function SosQuickAccess() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/5 to-rose-500/5 px-4 py-6 lg:hidden">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Need urgent help?</p>
      <Link
        href="/dashboard/emergency"
        aria-label="Open emergency mode"
        className="group relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-500" />
        <span className="relative flex flex-col items-center">
          <Siren className="h-8 w-8" />
          <span className="mt-1 text-base font-extrabold tracking-widest">SOS</span>
          <span className="text-[9px] uppercase tracking-widest text-white/80">Press if emergency</span>
        </span>
      </Link>
      <p className="text-[11px] text-muted-foreground">Alerts your contacts with your live location.</p>
    </div>
  );
}
