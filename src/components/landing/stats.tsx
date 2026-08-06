"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/lib/constants";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <span ref={ref} className="text-4xl font-bold tracking-tight sm:text-5xl">
      {inView ? value.toLocaleString() : 0}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section id="stats" className="relative py-24">
      <div className="container">
        <div className="glass-strong relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-teal/10 px-6 py-14 sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
          <div className="relative grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
