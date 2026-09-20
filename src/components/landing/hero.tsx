"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Bot, CalendarHeart, ShieldCheck, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { AuthAwareButton } from "@/components/landing/auth-aware-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A magnetic button wrapper */
function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block w-full sm:w-auto"
    >
      {children}
    </motion.div>
  );
}

/** Placeholder for a 3D element (Spline/Three.js) */
function GlowingCore() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { duration: 20, ease: "linear", repeat: Infinity },
          scale: { duration: 4, ease: "easeInOut", repeat: Infinity }
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-teal-500 to-sky-500 opacity-20 blur-3xl" 
      />
      
      <div className="relative z-10 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] perspective preserve-3d">
        <motion.div
          animate={{
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
          }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="w-full h-full rounded-full border border-primary/30 flex items-center justify-center glass-premium"
        >
          <motion.div
            animate={{
              rotateX: [360, 180, 0],
              rotateY: [360, 180, 0],
            }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="w-[70%] h-[70%] rounded-full border border-teal-500/50 flex items-center justify-center bg-primary/10 backdrop-blur-md"
          >
            <Bot className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <motion.div style={{ y: contentY, opacity }} className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
                <HeartPulse className="h-3.5 w-3.5" />
                Next-Gen AI Healthcare
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl text-white"
            >
              Your health, <br />
              <span className="text-gradient font-extrabold tracking-tighter drop-shadow-lg">
                intelligently
              </span>{" "}
              <br />cared for.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-lg"
            >
              Book appointments, store medical records, get AI health guidance and never miss a dose —
              all in one beautifully simple platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 relative z-20 w-full sm:w-auto"
            >
              <Magnetic>
                <AuthAwareButton href="/signup" loggedInLabel="Open dashboard" size="xl" className="w-full sm:w-auto shadow-glow-primary rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </AuthAwareButton>
              </Magnetic>

              <Magnetic>
                <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white" asChild>
                  <a href="#features">Explore features</a>
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Right: 3D Core Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", damping: 20 }}
            className="flex justify-center lg:justify-end"
          >
            <GlowingCore />
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
