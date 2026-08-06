import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthShell({
  children,
  title,
  subtitle,
  wide,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  wide?: boolean;
}) {
  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>

      <Card className={cn("glass-strong border-0", wide && "max-w-lg mx-auto")}>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}
