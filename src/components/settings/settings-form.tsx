"use client";

import { Bell, Eye, Globe, KeyRound, Moon, Shield, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/lib/constants";
import { saveSettings } from "@/lib/services/profile";
import type { UserSettings } from "@/types";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  notifications: true,
  email_notifications: true,
  push_notifications: true,
  language: "en",
  two_factor: false,
  share_emergency: true,
  privacy: "private",
};

export function SettingsForm({ initial }: { initial: Partial<UserSettings> }) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({ ...DEFAULT_SETTINGS, ...initial });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  async function update(patch: Partial<UserSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    setSaved(true);
    try {
      await saveSettings(next);
    } catch {
      // demo mode — local only
    }
  }

  function setThemeAndSave(value: string) {
    setTheme(value);
    update({ theme: value as UserSettings["theme"] });
  }

  return (
    <div className="space-y-6">
      {saved && <Badge variant="success" className="fixed bottom-6 right-6 z-50">Settings saved</Badge>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" /> Appearance
          </CardTitle>
          <CardDescription>Choose how Health Care looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Zap, label: "System" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setThemeAndSave(opt.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  theme === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:border-primary/40"
                }`}
              >
                <opt.icon className={`h-6 w-6 ${theme === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            title="Push notifications"
            description="Medicine reminders, appointment updates and alerts."
            checked={settings.push_notifications}
            onCheckedChange={(v) => update({ push_notifications: v })}
          />
          <ToggleRow
            title="Email notifications"
            description="Booking confirmations and weekly health summaries."
            checked={settings.email_notifications}
            onCheckedChange={(v) => update({ email_notifications: v })}
          />
          <ToggleRow
            title="In-app notifications"
            description="Show a notification panel badge for unread items."
            checked={settings.notifications}
            onCheckedChange={(v) => update({ notifications: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Privacy & security
          </CardTitle>
          <CardDescription>Control who can see your health data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Share medical profile in SOS</p>
              <p className="text-xs text-muted-foreground">
                Responders and emergency contacts can see blood group and allergies during an alert.
              </p>
            </div>
            <Switch
              checked={settings.share_emergency}
              onCheckedChange={(v) => update({ share_emergency: v })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account (requires Supabase email OTP).
              </p>
            </div>
            <Switch checked={settings.two_factor} onCheckedChange={(v) => update({ two_factor: v })} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Change password</p>
              <p className="text-xs text-muted-foreground">We&apos;ll email you a secure reset link.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/forgot-password">
                <KeyRound className="h-4 w-4" /> Reset
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Language
          </CardTitle>
          <CardDescription>Preferred language for the interface and AI responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={settings.language} onValueChange={(v) => update({ language: v })}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Your data stays encrypted and private. Health records are never shared without your consent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
