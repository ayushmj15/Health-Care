"use client";

import { motion } from "framer-motion";
import {
  Bot,
  CalendarHeart,
  FolderHeart,
  MapPin,
  Pill,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const FEATURES: { icon: LucideIcon; title: string; description: string; gradient: string }[] = [
  {
    icon: Bot,
    title: "AI Health Assistant",
    description: "Ask about symptoms, understand your reports and get specialist suggestions instantly with Gemini AI.",
    gradient: "from-primary to-sky-500",
  },
  {
    icon: CalendarHeart,
    title: "Smart Appointments",
    description: "Find the right doctor, pick a slot from live availability and book in under a minute — in-person or video.",
    gradient: "from-teal to-emerald-500",
  },
  {
    icon: FolderHeart,
    title: "Digital Health Records",
    description: "Upload prescriptions, blood reports, X-rays, MRI and CT scans. Everything searchable, forever.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Pill,
    title: "Medicine Reminders",
    description: "Track dosages and schedules. Get notified at the right time and never miss a pill again.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: MapPin,
    title: "Hospital Locator",
    description: "Google Maps powered search of nearby hospitals with distances, ratings and emergency filters.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Siren,
    title: "One-Tap Emergency",
    description: "Share your live location, alert emergency contacts and find the nearest care in a crisis.",
    gradient: "from-red-500 to-rose-600",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need, nothing you don't"
          description="A complete healthcare toolkit designed for real people — from daily reminders to emergency response."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.18]`}
              />
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
