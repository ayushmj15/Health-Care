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
import { Card3D } from "@/components/ui/card-3d";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
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

export function Features() {
  return (
    <section id="features" className="relative py-24">
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-teal/5 blur-[120px]" />
      </div>

      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need, nothing you don't"
          description="A complete healthcare toolkit designed for real people — from daily reminders to emergency response."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card3D depth="subtle" className="group h-full overflow-hidden p-6">
                {/* Background glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.18]`}
                />
                {/* Icon */}
                <motion.div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>

                {/* Bottom gradient line on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
