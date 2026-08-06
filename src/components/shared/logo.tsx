import { Activity } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
        <Activity className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-tight">
        {APP_NAME.split(" ")[0]}{" "}
        <span className="text-gradient">{APP_NAME.split(" ").slice(1).join(" ")}</span>
      </span>
    </Link>
  );
}
