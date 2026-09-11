"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Faq() {
  return (
    <section id="faq" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers to the things people ask us most."
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card transition-all duration-300",
        isOpen ? "shadow-3d" : "shadow-sm hover:shadow-md"
      )}
    >
      {/* Active accent border */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-0 top-0 bottom-0 w-1 origin-top bg-gradient-to-b from-primary via-sky-500 to-teal"
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold sm:text-base"
      >
        {question}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
