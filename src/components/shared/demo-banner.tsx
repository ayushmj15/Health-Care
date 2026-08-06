"use client";

import { FlaskConical } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Banner shown when Supabase isn't configured — the app is running
 * on demo data so the full UI can be explored.
 */
export function DemoModeBanner() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/15 via-amber-400/15 to-amber-500/15 px-4 py-2 text-center text-xs font-medium text-amber-700 backdrop-blur-xl dark:text-amber-400">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      <span>
        Demo mode — showing sample data. Add your Supabase keys in <code className="rounded bg-muted px-1">.env.local</code> to
        go live.
      </span>
    </div>
  );
}
