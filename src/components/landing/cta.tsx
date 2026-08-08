"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuthAwareButton } from "@/components/landing/auth-aware-button";

export function Cta() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-sky-600 to-teal px-6 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your health journey starts today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/85">
            Join 120,000+ people who manage their health smarter with Health Care. Free forever.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AuthAwareButton
              href="/signup"
              loggedInLabel="Open dashboard"
              size="xl"
              className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
            >
              Create free account <ArrowRight className="ml-1 h-4 w-4" />
            </AuthAwareButton>
            <AuthAwareButton
              href="/login"
              size="xl"
              variant="outline"
              className="w-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:w-auto"
            >
              Log in
            </AuthAwareButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
