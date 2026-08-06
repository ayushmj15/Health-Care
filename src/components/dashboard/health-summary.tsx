import { Activity, Droplets, HeartPulse, Ruler, Weight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types";

function bmi(heightCm: number | null, weightKg: number | null): number | null {
  if (!heightCm || !weightKg) return null;
  const h = heightCm / 100;
  return weightKg / (h * h);
}

function bmiCategory(value: number) {
  if (value < 18.5) return { label: "Underweight", variant: "warning" as const };
  if (value < 25) return { label: "Healthy", variant: "success" as const };
  if (value < 30) return { label: "Overweight", variant: "warning" as const };
  return { label: "Obese", variant: "destructive" as const };
}

export function HealthSummary({ user }: { user: UserProfile }) {
  const value = bmi(user.height_cm, user.weight_kg);
  const cat = value ? bmiCategory(value) : null;

  const metrics = [
    { icon: Activity, label: "Blood group", value: user.blood_group ?? "—" },
    { icon: HeartPulse, label: "Blood pressure", value: user.chronic_diseases.includes("Hypertension") ? "Monitored" : "Normal range" },
    { icon: Ruler, label: "Height", value: user.height_cm ? `${user.height_cm} cm` : "—" },
    { icon: Weight, label: "Weight", value: user.weight_kg ? `${user.weight_kg} kg` : "—" },
    { icon: Droplets, label: "BMI", value: value ? value.toFixed(1) : "—" },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Health summary</CardTitle>
        {cat && <Badge variant={cat.variant}>{cat.label}</Badge>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border bg-muted/20 p-3">
              <m.icon className="h-4 w-4 text-primary" />
              <p className="mt-2 text-[11px] text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          ))}
        </div>

        {(user.chronic_diseases.length > 0 || user.allergies.length > 0) && (
          <div className="mt-4 space-y-3">
            {user.chronic_diseases.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Chronic:</span>
                {user.chronic_diseases.map((d) => (
                  <Badge key={d} variant="secondary">
                    {d}
                  </Badge>
                ))}
              </div>
            )}
            {user.allergies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Allergies:</span>
                {user.allergies.map((a) => (
                  <Badge key={a} variant="destructive">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
