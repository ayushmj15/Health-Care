import { isSupabaseConfigured } from "@/lib/supabase/config";

/** True when the app is running without Supabase (demo data mode). */
export const isDemo = !isSupabaseConfigured();
