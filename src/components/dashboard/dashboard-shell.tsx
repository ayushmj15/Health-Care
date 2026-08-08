"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DemoModeBanner } from "@/components/shared/demo-banner";
import { OnboardingGate } from "@/components/dashboard/onboarding-gate";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationsDropdown, UserMenu } from "@/components/dashboard/user-menu";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { AiAssistantFab } from "@/components/dashboard/ai-assistant-fab";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/providers/user-provider";
import { DASHBOARD_NAV, ADMIN_NAV } from "@/lib/constants";
import type { UserProfile } from "@/types";

export function DashboardShell({
  user,
  isDemo,
  onboardingRequired,
  children,
}: {
  user: UserProfile | null;
  isDemo: boolean;
  onboardingRequired?: boolean;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const displayName = user?.full_name ?? (user?.email?.split("@")[0] ?? "Guest");
  const isAdmin = user?.role === "admin";
  const isOnboardingPath = pathname === "/dashboard/profile" || pathname === "/dashboard/emergency";
  const gated = Boolean(onboardingRequired) && !isOnboardingPath;

  return (
    <UserProvider value={{ user, isDemo, setUser: () => {} }}>
      <TooltipProvider delayDuration={200}>
        <div className="min-h-screen">
          <DemoModeBanner />

          {/* Desktop sidebar */}
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background/80 backdrop-blur-xl lg:block">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6">
                <Logo href="/dashboard" />
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-5">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Menu
                </p>
                <SidebarNav items={DASHBOARD_NAV} />
                {isAdmin && (
                  <>
                    <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Admin
                    </p>
                    <SidebarNav items={ADMIN_NAV} />
                  </>
                )}
              </div>
              <div className="border-t p-4">
                <p className="px-2 text-xs text-muted-foreground">
                  Need urgent help?
                  <a href="/dashboard/emergency" className="ml-1 font-medium text-red-500 hover:underline">
                    Open Emergency
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex min-h-screen flex-col lg:pl-64">
            {/* Top bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-2">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <div className="flex h-full flex-col">
                      <div className="flex h-16 items-center border-b px-6">
                        <Logo href="/dashboard" />
                      </div>
                      <div className="flex-1 overflow-y-auto px-3 py-5">
                        <SidebarNav items={DASHBOARD_NAV} onNavigate={() => setMobileOpen(false)} />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="hidden sm:block">
                  <p className="text-sm text-muted-foreground">Welcome back,</p>
                  <p className="text-sm font-semibold leading-tight">{displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                {user && <NotificationsDropdown userId={user.id} />}
                {user && (
                  <UserMenu
                    name={displayName}
                    email={user.email}
                    avatar={user.avatar_url}
                    role={user.role}
                    isAdmin={isAdmin}
                  />
                )}
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{gated ? <OnboardingGate /> : children}</main>

            <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
              Health Care · AI guidance is informational only and not a substitute for professional medical advice.
            </footer>
          </div>

          <AiAssistantFab />
        </div>
      </TooltipProvider>
    </UserProvider>
  );
}
