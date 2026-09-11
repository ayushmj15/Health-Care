"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 22,
    },
  },
};

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by patients, trusted by doctors"
          description="Hear from the people who use Health Care every day."
        />

        {/* Mobile: Horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="mt-16 flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory sm:hidden"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 200, damping: 22 }}
              className="relative flex w-[85vw] min-w-[85vw] snap-center flex-col justify-between rounded-2xl border bg-card p-6 shadow-3d"
            >
              <TestimonialContent t={t} index={i} />
            </motion.figure>
          ))}
        </div>

        {/* Desktop: Grid */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-3d transition-shadow hover:shadow-3d-lg"
            >
              <TestimonialContent t={t} index={i} />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialContent({
  t,
  index,
}: {
  t: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  return (
    <>
      <div>
        <Quote className="h-7 w-7 text-primary/30" />
        <div className="mt-3 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, s) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0, rotate: -72 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05 + s * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  s < t.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted"
                )}
              />
            </motion.div>
          ))}
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        <div className="relative">
          {/* Gradient ring pulse */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-teal opacity-20 blur-sm animate-pulse" />
          <Avatar className="relative">
            <AvatarFallback className="bg-gradient-to-br from-primary to-teal text-white">
              {t.avatar}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </figcaption>
    </>
  );
}
