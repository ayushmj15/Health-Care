"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by patients, trusted by doctors"
          description="Hear from the people who use Health Care every day."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="relative flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <Quote className="h-7 w-7 text-primary/30" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-primary to-teal text-white">
                    {t.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
