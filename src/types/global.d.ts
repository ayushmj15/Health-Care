export {};

declare global {
  interface Window {
    /** True when Supabase env vars are absent → the app runs in demo mode. */
    __SUPABASE_DEMO__?: boolean;
  }
}
