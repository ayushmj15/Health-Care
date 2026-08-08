import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "AI Assistant", href: "/dashboard/assistant" },
      { label: "Find Hospitals", href: "/dashboard/hospitals" },
      { label: "Book Appointment", href: "/dashboard/appointments" },
      { label: "Health Records", href: "/dashboard/records" },
      { label: "Medicine Reminders", href: "/dashboard/medicines" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Medical Disclaimer", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An AI-powered healthcare accessibility platform helping patients book care, manage records, and stay
              healthy — anywhere, anytime.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground">
              <HeartPulse className="h-4 w-4 text-red-500" />
              Built with care. Not a replacement for professional medical advice.
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Health Care. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <InstallAppButton size="sm" variant="outline" label="Install on your phone" />
            <p className="text-xs text-muted-foreground">Made with 💙 for healthier lives</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
