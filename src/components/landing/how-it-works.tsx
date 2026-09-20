"use client";

import { motion, useInView } from "framer-motion";
import { Bot, CalendarCheck2, Search, UserPlus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your profile",
    description: "Sign up in seconds and add your health basics like blood group, allergies, and emergency contacts. Your data is 256-bit encrypted.",
    graphic: "bg-gradient-to-br from-primary/20 to-sky-500/20",
    illustration: UserPlus,
  },
  {
    icon: Bot,
    step: "02",
    title: "Ask the AI assistant",
    description: "Check symptoms, understand complex medical reports, and get a specialist recommendation — 24/7, in plain language.",
    graphic: "bg-gradient-to-bl from-teal-500/20 to-emerald-500/20",
    illustration: Bot,
  },
  {
    icon: Search,
    step: "03",
    title: "Find the right hospital",
    description: "Locate nearby hospitals on the map, compare ratings and distances, and pick the care that perfectly fits your needs.",
    graphic: "bg-gradient-to-tr from-violet-500/20 to-purple-500/20",
    illustration: Search,
  },
  {
    icon: CalendarCheck2,
    step: "04",
    title: "Book & stay on track",
    description: "Book an appointment, get instantly confirmed, and let smart reminders handle your medicines going forward.",
    graphic: "bg-gradient-to-tl from-amber-500/20 to-orange-500/20",
    illustration: CalendarCheck2,
  },
];

function StepItem({ step, index, setActiveIndex }: { step: typeof STEPS[0], index: number, setActiveIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <div ref={ref} className="py-24 md:py-32 flex flex-col justify-center min-h-[50vh]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 glass-premium text-primary">
            <step.icon className="h-6 w-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-primary/80">Step {step.step}</span>
        </div>
        
        <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
        <p className="text-lg leading-relaxed text-muted-foreground">{step.description}</p>
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="how-it-works" className="relative py-24 bg-[#0a0a0a]">
      <div className="container">
        <SectionHeading
          eyebrow="Dynamic Journey"
          title="Better care in four simple steps"
          description="From first login to full care management — a journey designed to be completely effortless."
        />

        <div className="mt-16 flex flex-col md:flex-row relative items-start">
          
          {/* Left: Scrollable Steps */}
          <div className="w-full md:w-1/2 md:pr-12 lg:pr-24 relative z-10">
            {STEPS.map((step, i) => (
              <StepItem key={step.step} step={step} index={i} setActiveIndex={setActiveIndex} />
            ))}
          </div>

          {/* Right: Sticky Graphic */}
          <div className="hidden md:block w-1/2 sticky top-32 h-[60vh] rounded-3xl overflow-hidden glass-premium border border-white/10 shadow-2xl">
            {STEPS.map((step, i) => {
              const isActive = i === activeIndex;
              const Icon = step.illustration;
              return (
                <motion.div
                  key={step.step}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.95,
                    y: isActive ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={cn("absolute inset-0 flex items-center justify-center", step.graphic)}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  <div className="relative w-48 h-48 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner">
                    <motion.div
                      animate={isActive ? { y: [0, -10, 0] } : {}}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Icon className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
