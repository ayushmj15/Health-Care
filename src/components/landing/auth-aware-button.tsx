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
  hideWhenLoggedIn,
  children,
  hideWhenAuthed,
  ...props
}: { href: string; loggedInLabel?: string; hideWhenLoggedIn?: boolean; children: React.ReactNode; hideWhenAuthed?: boolean } & ButtonProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        if (!cancelled) {
          setAuthed(true);
          setChecking(false);
        }
        return;
      }
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = await createClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setAuthed(Boolean(data.session));
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          setAuthed(false);
          setChecking(false);
        }
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (hideWhenAuthed && authed) return null;

  async function go() {
    if (checking) return; // Wait for auth check to complete
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

  if (authed && hideWhenLoggedIn) return null;

  return (
    <Button {...props} onClick={go} disabled={checking}>
      {authed && loggedInLabel ? loggedInLabel : children}
    </Button>
  );
}
