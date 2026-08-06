import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * If already authenticated (or running demo mode with a session),
 * bounce users away from auth pages.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect("/dashboard");
    } catch {
      // not configured / offline — fall through
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid px-4 py-12">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-[380px] w-[480px] rounded-full bg-teal/10 blur-[120px]" />
      {children}
    </div>
  );
}
