"use client";

import { motion } from "framer-motion";
import { Bot, CalendarCheck2, Search, UserPlus } from "lucide-react";
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Better care in four simple steps"
          description="From first login to full care management — a journey designed to be effortless."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border bg-card shadow-lg">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              <span className="mt-5 block text-xs font-bold uppercase tracking-widest text-primary">{step.step}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
