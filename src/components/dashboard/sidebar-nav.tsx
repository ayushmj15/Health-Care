"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DashboardNavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SidebarNav({
  items,
  onNavigate,
}: {
  items: DashboardNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {/* Animated active indicator pill */}
            {active && (
              <motion.span
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}

            {/* Icon with color transition */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <item.icon
                className={cn("h-5 w-5 shrink-0 transition-colors", active && "text-primary")}
                strokeWidth={active ? 2.4 : 2}
              />
            </motion.div>

            <span className="truncate">{item.title}</span>

            {/* Hover background sweep */}
            {!active && (
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-accent/0 transition-colors group-hover:bg-accent/50" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarIconNav({ items, onNavigate }: { items: DashboardNavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1.5">
      {items.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-label={item.title}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-icon-indicator"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <item.icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.title}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
