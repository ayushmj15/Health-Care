"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/shared/motion";
import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section id="stats" className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 18 }}
          className="glass-strong relative overflow-hidden rounded-3xl border px-6 py-14 sm:px-12"
          style={{
            backgroundImage: "linear-gradient(to right, hsl(var(--primary) / 0.08), hsl(var(--background)), hsl(var(--teal) / 0.08))",
            backgroundSize: "200% 100%",
            animation: "gradient-shift 8s ease infinite",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />

          <div className="relative grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 180, damping: 18 }}
                className="relative"
              >
                {/* Radial progress ring behind stat */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="text-primary">
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={339}
                      initial={{ strokeDashoffset: 339 }}
                      whileInView={{ strokeDashoffset: 339 * (1 - (i + 1) / 5) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                </div>

                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl font-bold tracking-tight sm:text-5xl"
                />
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
