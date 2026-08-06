import { CalendarHeart, FolderHeart, MapPin, MessageSquareHeart, Siren } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

const ACTIONS = [
  { href: "/dashboard/appointments", icon: CalendarHeart, label: "Book appointment", gradient: "from-primary to-sky-500" },
  { href: "/dashboard/hospitals", icon: MapPin, label: "Find a hospital", gradient: "from-teal to-emerald-500" },
  { href: "/dashboard/assistant", icon: MessageSquareHeart, label: "Ask the AI", gradient: "from-violet-500 to-purple-500" },
  { href: "/dashboard/records", icon: FolderHeart, label: "Upload report", gradient: "from-amber-500 to-orange-500" },
];

export function WelcomeCard({ user }: { user: UserProfile }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (user.full_name ?? "there").split(" ")[0];

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary via-sky-600 to-teal text-white">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <CardContent className="relative p-6 sm:p-8">
        <p className="text-sm text-white/80">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/85">
          Here&apos;s your health at a glance. You&apos;ve got everything you need to stay on track today.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group flex flex-col items-start gap-2 rounded-xl bg-white/10 p-3 backdrop-blur transition-all hover:bg-white/20 hover:shadow-lg",
              )}
            >
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow", action.gradient)}>
                <action.icon className="h-4.5 w-4.5 h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-white">{action.label}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/dashboard/emergency"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-500"
        >
          <Siren className="h-4 w-4" />
          Emergency SOS
        </Link>
      </CardContent>
    </Card>
  );
}
