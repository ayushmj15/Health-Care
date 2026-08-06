"use client";

import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RECOMMENDATIONS = [
  {
    icon: Sparkles,
    title: "Schedule a cardiac check-up",
    desc: "Your lipid profile from last month was slightly elevated. A follow-up is recommended within 3 months.",
    tag: "High priority",
    variant: "destructive" as const,
  },
  {
    icon: Sparkles,
    title: "Complete your Vitamin D course",
    desc: "3 weekly doses remaining. Consistent intake improves absorption — take with a fatty meal.",
    tag: "Medicine",
    variant: "warning" as const,
  },
  {
    icon: Sparkles,
    title: "Try 30 min of light walking daily",
    desc: "Based on your activity and BP profile, daily walking can meaningfully lower resting blood pressure.",
    tag: "Lifestyle",
    variant: "success" as const,
  },
];

export function AiRecommendationsCard() {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5 text-primary" />
          AI recommendations
        </CardTitle>
        <Badge variant="secondary">For you</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {RECOMMENDATIONS.map((rec, i) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-xl border bg-muted/20 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <rec.icon className="h-4 w-4 text-primary" />
                {rec.title}
              </p>
              <Badge variant={rec.variant} className="shrink-0">
                {rec.tag}
              </Badge>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{rec.desc}</p>
          </motion.div>
        ))}

        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/assistant">
            <Bot className="h-4 w-4" />
            Ask the AI for more tips
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
