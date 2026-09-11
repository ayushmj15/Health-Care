"use client";

import { motion, useInView, useSpring, useTransform, useMotionValue, type Variants } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";

/* ─── Fade-in (original, preserved) ─── */
export function FadeIn({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page transition (original, preserved) ─── */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Slide in from any direction ─── */
export function SlideIn({
  children,
  from = "bottom",
  delay = 0,
  distance = 24,
  className,
  once = true,
}: {
  children: React.ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  delay?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}) {
  const axis = from === "left" || from === "right" ? "x" : "y";
  const sign = from === "left" || from === "top" ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, [axis]: sign * distance }}
      whileInView={{ opacity: 1, [axis]: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scale in ─── */
export function ScaleIn({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger container + item ─── */
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function StaggerContainer({
  children,
  className,
  once = true,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  staggerDelay?: number;
}) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─── */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, motionVal]);

  const display = useTransform(spring, (v) => {
    if (v >= 1000) return Math.round(v).toLocaleString();
    if (Number.isInteger(value)) return Math.round(v).toString();
    return v.toFixed(1);
  });

  return (
    <span ref={ref} className={className}>
      <motion.span>{inView ? display : "0"}</motion.span>
      {suffix}
    </span>
  );
}

/* ─── Parallax section wrapper ─── */
export function ParallaxSection({
  children,
  className,
  speed = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    y.set((center - viewCenter) * speed);
  }, [speed, y]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}
