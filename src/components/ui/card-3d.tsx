"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent, type TouchEvent } from "react";
import { cn } from "@/lib/utils";

type Depth = "subtle" | "medium" | "dramatic";

const TILT_MAP: Record<Depth, number> = {
  subtle: 4,
  medium: 8,
  dramatic: 14,
};

export function Card3D({
  children,
  className,
  depth = "medium",
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  depth?: Depth;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const maxTilt = TILT_MAP[depth];

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  });

  // All hooks called unconditionally (React rules of hooks)
  const glareOpacity = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const dist = Math.sqrt(
        Math.pow(latestX - 0.5, 2) + Math.pow(latestY - 0.5, 2)
      );
      return Math.min(dist * 0.5, 0.18);
    }
  );
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]: string[]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 60%)`
  );

  function updatePosition(clientX: number, clientY: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((clientX - rect.left) / rect.width);
    y.set((clientY - rect.top) / rect.height);
  }

  function handleMouseMove(e: MouseEvent) {
    updatePosition(e.clientX, e.clientY);
  }

  function handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch) updatePosition(touch.clientX, touch.clientY);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div className="perspective" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleLeave}
        onTouchEnd={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
        className={cn(
          "relative rounded-2xl border bg-card transition-shadow duration-300",
          "shadow-3d hover:shadow-3d-lg",
          className
        )}
      >
        {children}

        {/* Glare highlight — always rendered but opacity-hidden when disabled */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
            style={{
              opacity: glareOpacity,
              background: glareBackground,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
