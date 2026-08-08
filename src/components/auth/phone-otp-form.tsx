"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Smartphone } from "lucide-react";
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
import { phoneSchema, phoneVerifySchema, type PhoneInput, type PhoneVerifyInput } from "@/lib/validations";

export function PhoneOtpForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const phoneForm = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<PhoneVerifyInput>({
    resolver: zodResolver(phoneVerifySchema),
    defaultValues: { phone: "", otp: "" },
  });

  async function sendOtp(values: PhoneInput) {
    setSending(true);
    try {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        otpForm.setValue("phone", values.phone);
        setStep("otp");
        return;
      }

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: values.phone,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;

      otpForm.setValue("phone", values.phone);
      setStep("otp");
      toast.success("OTP sent — check your phone");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the OTP. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp(values: PhoneVerifyInput) {
    setVerifying(true);
    try {
      if (typeof window !== "undefined" && window.__SUPABASE_DEMO__) {
        window.location.href = "/dashboard";
        return;
      }

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: values.phone,
        token: values.otp,
        type: "sms",
      });
      if (error) throw error;

      toast.success(mode === "signup" ? "Account created. Welcome!" : "Welcome back!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  if (step === "otp") {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(verifyOtp)} className="space-y-4">
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6-digit code"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground">
            We sent a code to <span className="font-medium text-foreground">{otpForm.watch("phone")}</span>
          </p>
          <Button type="submit" className="w-full" disabled={verifying}>
            {verifying && <Spinner />}
            {mode === "signup" ? "Create account" : "Log in"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("phone")}
          >
            Change number
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneForm.handleSubmit(sendOtp)} className="space-y-4">
        <FormField
          control={phoneForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={sending}>
          {sending ? <Spinner /> : <Smartphone className="h-4 w-4" />}
          Send OTP
        </Button>
      </form>
    </Form>
  );
}
