"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  return (
    <motion.details
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-2xl border bg-card p-5 [&[open]]:shadow-md"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base">
        {question}
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground")}>{answer}</p>
    </motion.details>
  );
}
