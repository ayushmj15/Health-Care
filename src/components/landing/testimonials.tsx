"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Duplicate the array to create a seamless infinite loop
const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="container relative z-10 mb-16">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by patients, trusted by doctors"
          description="Hear from the people who use Health Care every day."
        />
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex w-full overflow-hidden">
        
        {/* Left/Right Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex gap-6 w-max pl-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
        >
          {MARQUEE_ITEMS.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="relative flex w-[350px] md:w-[400px] flex-col justify-between rounded-3xl border border-white/10 glass-premium p-8 shadow-2xl flex-shrink-0 hover:border-white/20 transition-colors"
            >
              <TestimonialContent t={t} index={i} />
            </div>
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
        <Quote className="h-8 w-8 text-primary/40 mb-4 drop-shadow-md" />
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star
              key={s}
              className={cn(
                "h-4 w-4",
                s < t.rating
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <blockquote className="text-base leading-relaxed text-muted-foreground">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      
      <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
        <div className="relative">
          <Avatar className="relative h-12 w-12 border border-white/10 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-primary to-teal-500 text-white font-bold">
              {t.avatar}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-base font-semibold text-white tracking-tight">{t.name}</p>
          <p className="text-sm text-primary/80">{t.role}</p>
        </div>
      </figcaption>
    </>
  );
}
