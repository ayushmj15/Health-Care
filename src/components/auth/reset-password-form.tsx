"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "@/components/auth/auth-icons";
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
import { resetPasswordSchema, type LoginInput } from "@/lib/validations";

type ResetInput = Pick<LoginInput, "password"> & { confirmPassword: string };

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<ResetInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetInput) {
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        await new Promise((r) => setTimeout(r, 600));
        setDone(true);
        return;
      }
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
        Your password has been reset. You can now{" "}
        <a href="/login" className="font-semibold underline">
          log in
        </a>
        .
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repeat password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Spinner />}
          Update password
        </Button>
      </form>
    </Form>
  );
}
