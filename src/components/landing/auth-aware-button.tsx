"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * CTA that knows whether the visitor is signed in.
 * Routes straight to /dashboard when a session exists (no double log-in),
 * otherwise falls back to the given href (e.g. /signup or /login).
 */
export function AuthAwareButton({
  href,
  loggedInLabel,
  children,
  ...props
}: { href: string; loggedInLabel?: string; children: React.ReactNode } & ButtonProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        if (!cancelled) setAuthed(true);
        return;
      }
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = await createClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setAuthed(Boolean(data.session));
      } catch {
        if (!cancelled) setAuthed(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  async function go() {
    if (authed) {
      router.push("/dashboard");
      return;
    }
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/dashboard");
      else router.push(href);
    } catch {
      router.push(href);
    }
  }

  return (
    <Button {...props} onClick={go}>
      {authed && loggedInLabel ? loggedInLabel : children}
    </Button>
  );
}
