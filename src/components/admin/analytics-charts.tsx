"use client";

import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "@/types";

const LIGHT_PALETTE = ["#2563eb", "#0d9488", "#8b5cf6", "#f59e0b", "#ef4444", "#64748b", "#14b8a6", "#6366f1"];
const DARK_PALETTE = ["#60a5fa", "#2dd4bf", "#a78bfa", "#fbbf24", "#f87171", "#94a3b8", "#5eead4", "#818cf8"];

function usePalette() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
}

function axisStyle() {
  return {
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  };
}

function tooltipStyle() {
  return {
    borderRadius: 12,
    border: "1px solid hsl(var(--border))",
    background: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
    fontSize: 12,
    boxShadow: "0 8px 30px rgb(0 0 0 / 0.12)",
  };
}

export function AppointmentsTrendChart({ data }: { data: AnalyticsData["appointmentsTrend"] }) {
  const palette = usePalette();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Appointments Trend</CardTitle>
        <CardDescription>Bookings over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="apptFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={palette[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" {...axisStyle()} />
              <YAxis stroke="hsl(var(--muted-foreground))" {...axisStyle()} />
              <Tooltip contentStyle={tooltipStyle()} />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke={palette[0]}
                strokeWidth={2.5}
                fill="url(#apptFill)"
                name="Appointments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PatientGrowthChart({ data }: { data: AnalyticsData["patientGrowth"] }) {
  const palette = usePalette();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Patient Growth</CardTitle>
        <CardDescription>Registered patients over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" {...axisStyle()} />
              <YAxis stroke="hsl(var(--muted-foreground))" {...axisStyle()} />
              <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              <Bar dataKey="patients" fill={palette[1]} radius={[6, 6, 0, 0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function SpecialityPieChart({ data }: { data: AnalyticsData["specialityDistribution"] }) {
  const palette = usePalette();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Speciality Distribution</CardTitle>
        <CardDescription>Appointments by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: palette[i % palette.length] }} />
              <span className="truncate text-muted-foreground">
                {entry.name} <span className="font-medium text-foreground">{entry.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusDistributionChart({ data }: { data: AnalyticsData["statusDistribution"] }) {
  const palette = usePalette();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Appointment Status</CardTitle>
        <CardDescription>Distribution of appointment states</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" {...axisStyle()} />
              <YAxis type="category" dataKey="status" stroke="hsl(var(--muted-foreground))" {...axisStyle()} width={80} />
              <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Appointments">
                {data.map((entry, i) => (
                  <Cell key={entry.status} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
