"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Bot, CalendarHeart, FolderHeart, MapPin, Pill, Siren, type LucideIcon } from "lucide-react";
import { useRef, MouseEvent } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Health Assistant",
    description: "Ask about symptoms, understand your reports and get specialist suggestions instantly with Gemini AI.",
    gradient: "from-primary to-sky-500",
    colSpan: "md:col-span-2",
  },
  {
    icon: CalendarHeart,
    title: "Smart Appointments",
    description: "Find the right doctor and book in under a minute.",
    gradient: "from-teal to-emerald-500",
    colSpan: "md:col-span-1",
  },
  {
    icon: FolderHeart,
    title: "Digital Health Records",
    description: "Upload prescriptions, blood reports, X-rays, MRI and CT scans. Everything searchable, forever.",
    gradient: "from-violet-500 to-purple-500",
    colSpan: "md:col-span-1",
  },
  {
    icon: MapPin,
    title: "Hospital Locator",
    description: "Google Maps powered search of nearby hospitals with distances and emergency filters.",
    gradient: "from-rose-500 to-pink-500",
    colSpan: "md:col-span-1",
  },
  {
    icon: Pill,
    title: "Medicine Reminders",
    description: "Track dosages and schedules. Never miss a pill again.",
    gradient: "from-amber-500 to-orange-500",
    colSpan: "md:col-span-1",
  },
  {
    icon: Siren,
    title: "One-Tap Emergency",
    description: "Share your live location, alert emergency contacts and find the nearest care in a crisis.",
    gradient: "from-red-500 to-rose-600",
    colSpan: "md:col-span-3",
  },
];

function BentoCard({ feature }: { feature: typeof FEATURES[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for radial gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tilt effects
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothTiltX = useSpring(tiltX, springConfig);
  const smoothTiltY = useSpring(tiltY, springConfig);

  const rotateX = useTransform(smoothTiltY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(smoothTiltX, [-0.5, 0.5], ["-5deg", "5deg"]);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // For radial gradient
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    // For tilt (-0.5 to 0.5)
    const xPos = (clientX - left) / width - 0.5;
    const yPos = (clientY - top) / height - 0.5;
    tiltX.set(xPos);
    tiltY.set(yPos);
  }

  function handleMouseLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("group relative rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 overflow-hidden glass-premium", feature.colSpan)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Radial Hover Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Inner Content */}
      <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
        <motion.div
          className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl", feature.gradient)}
        >
          <feature.icon className="h-7 w-7 text-white" />
        </motion.div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white tracking-tight">{feature.title}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Bento Features"
          title="Everything you need, nothing you don't"
          description="A complete healthcare toolkit designed for real people — beautifully crafted inside an intuitive bento grid."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mx-auto max-w-5xl">
          {FEATURES.map((feature) => (
            <BentoCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
