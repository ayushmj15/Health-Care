"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, CalendarCheck2, Search, UserPlus } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your profile",
    description: "Sign up in seconds with email or Google, and add your health basics like blood group, allergies and emergencies.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Ask the AI assistant",
    description: "Check symptoms, understand reports and get a specialist recommendation — 24/7, in plain language.",
  },
  {
    icon: Search,
    step: "03",
    title: "Find the right hospital",
    description: "Locate nearby hospitals on the map, compare ratings and distances, and pick the care that fits.",
  },
  {
    icon: CalendarCheck2,
    step: "04",
    title: "Book & stay on track",
    description: "Book an appointment, get confirmed, and let smart reminders handle your medicines going forward.",
  },
];

const iconVariants = {
  hidden: { opacity: 0, rotateY: -90, scale: 0.8 },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.8"],
  });

  // Animated connecting line progress
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Better care in four simple steps"
          description="From first login to full care management — a journey designed to be effortless."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Animated connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px overflow-hidden lg:block">
            <motion.div
              style={{ scaleX: lineScaleX, transformOrigin: "left" }}
              className="h-full w-full bg-gradient-to-r from-primary via-sky-500 to-teal"
            />
          </div>

          {/* Animated vertical timeline (mobile) */}
          <div className="absolute left-12 top-0 bottom-0 w-px overflow-hidden lg:hidden md:hidden">
            <motion.div
              style={{ scaleY: lineScaleX, transformOrigin: "top" }}
              className="h-full w-full bg-gradient-to-b from-primary via-sky-500 to-teal"
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* 3D flip icon */}
              <motion.div
                variants={iconVariants}
                style={{ perspective: 600, transformStyle: "preserve-3d" }}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border bg-card shadow-3d transition-shadow hover:shadow-3d-lg"
              >
                <step.icon className="h-10 w-10 text-primary" />
                {/* Pulse ring behind icon */}
                <span className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse-ring-expand" />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="mt-5 block text-xs font-bold uppercase tracking-widest text-primary"
              >
                {step.step}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.25 }}
                className="mt-2 text-lg font-semibold"
              >
                {step.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3 }}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
