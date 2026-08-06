"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoogleIcon, Spinner } from "@/components/auth/auth-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        await new Promise((r) => setTimeout(r, 800));
        window.location.href = "/dashboard";
        return;
      }

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;
      toast.success("Welcome back!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    setGoogleLoading(true);
    try {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        window.location.href = "/dashboard";
        return;
      }
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google login failed.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" className="w-full" disabled={googleLoading} onClick={googleLogin}>
        {googleLoading ? <Spinner /> : <GoogleIcon className="h-4 w-4" />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Spinner />}
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}
