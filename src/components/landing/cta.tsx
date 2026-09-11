"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthAwareButton } from "@/components/landing/auth-aware-button";

export function Cta() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 18 }}
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(217 91% 55%), hsl(199 89% 48%), hsl(178 100% 34%))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 6s ease infinite",
          }}
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

          {/* Floating sparkles */}
          {[
            { left: "10%", top: "15%", delay: 0 },
            { right: "15%", top: "20%", delay: 0.5 },
            { left: "20%", bottom: "25%", delay: 1 },
            { right: "10%", bottom: "15%", delay: 1.5 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute text-white/20"
              style={pos as React.CSSProperties}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: pos.delay,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          ))}

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Your health journey starts today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mx-auto mt-4 max-w-xl text-base text-white/85"
          >
            Join 120,000+ people who manage their health smarter with Health Care. Free forever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <AuthAwareButton
              href="/signup"
              loggedInLabel="Open dashboard"
              size="xl"
              className="w-full bg-white text-primary shadow-lg hover:bg-white/90 hover:shadow-xl transition-all sm:w-auto animate-glow-pulse"
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
