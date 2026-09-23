"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  CalendarHeart,
  Home,
  MapPin,
  MoreHorizontal,
  FolderHeart,
  Pill,
  Siren,
  Settings,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const PRIMARY_TABS: TabItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "AI", href: "/dashboard/assistant", icon: Bot },
  { title: "Hospitals", href: "/dashboard/hospitals", icon: MapPin },
  { title: "Bookings", href: "/dashboard/appointments", icon: CalendarHeart },
];

const MORE_ITEMS: TabItem[] = [
  { title: "Stores", href: "/dashboard/medical-stores", icon: Pill },
  { title: "Health Records", href: "/dashboard/records", icon: FolderHeart },
  { title: "Medicines", href: "/dashboard/medicines", icon: Pill },
  { title: "Emergency", href: "/dashboard/emergency", icon: Siren },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const isMoreActive = MORE_ITEMS.some((item) => isActive(item.href));

  return (
    <>
      {/* More drawer overlay + sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t bg-card pb-safe shadow-3d-lg lg:hidden"
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <h3 className="text-sm font-semibold">More</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 px-4 pb-6">
                {MORE_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all active:scale-95",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-accent"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                          isActive(item.href)
                            ? "bg-primary text-white shadow-glow-primary"
                            : "bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px] font-medium leading-tight">{item.title}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        <div className="glass-frosted border-t pb-safe">
          <div className="flex items-center justify-around px-2 pt-1.5 pb-1">
            {PRIMARY_TABS.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
                >
                  <motion.div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      active && "text-primary"
                    )}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <tab.icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={active ? 2.5 : 1.8}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {tab.title}
                  </span>
                  {/* Active indicator dot */}
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -top-1 h-[3px] w-5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More button */}
            <button
              onClick={() => setMoreOpen(true)}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              <motion.div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  isMoreActive && "text-primary"
                )}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <MoreHorizontal
                  className="h-[22px] w-[22px]"
                  strokeWidth={isMoreActive ? 2.5 : 1.8}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isMoreActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                More
              </span>
              {isMoreActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-1 h-[3px] w-5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
