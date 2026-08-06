"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.__SUPABASE_DEMO__ = !isSupabaseConfigured();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
