"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/lib/services/profile";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { BLOOD_GROUPS, GENDERS } from "@/lib/constants";
import type { UserProfile } from "@/types";

export function ProfileForm({ user, onSaved }: { user: UserProfile; onSaved?: (updated: UserProfile | null) => void }) {
  const [saving, setSaving] = useState(false);
  const [chronic, setChronic] = useState<string[]>(user.chronic_diseases);
  const [allergies, setAllergies] = useState<string[]>(user.allergies);
  const [tagInput, setTagInput] = useState({ chronic: "", allergy: "" });

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.full_name ?? "",
      phone: user.phone ?? "",
      gender: user.gender ?? "",
      dateOfBirth: user.date_of_birth ?? "",
      bloodGroup: user.blood_group ?? "",
      heightCm: user.height_cm ?? undefined,
      weightKg: user.weight_kg ?? undefined,
      address: user.address ?? "",
    },
  });

  async function onSubmit(values: ProfileInput) {
    setSaving(true);
    try {
      const updated = await updateProfile({
        id: user.id,
        full_name: values.fullName,
        phone: values.phone || null,
        gender: values.gender || null,
        date_of_birth: values.dateOfBirth || null,
        blood_group: values.bloodGroup as UserProfile["blood_group"],
        height_cm: values.heightCm ?? null,
        weight_kg: values.weightKg ?? null,
        chronic_diseases: chronic,
        allergies,
        address: values.address || null,
      });
      toast.success("Profile updated successfully.");
      onSaved?.(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  function addTag(kind: "chronic" | "allergy", value: string) {
    if (!value.trim()) return;
    if (kind === "chronic") {
      setChronic((p) => [...new Set([...p, value.trim()])]);
      setTagInput((t) => ({ ...t, chronic: "" }));
    } else {
      setAllergies((p) => [...new Set([...p, value.trim()])]);
      setTagInput((t) => ({ ...t, allergy: "" }));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal details */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Personal details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Medical details */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Medical details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood group</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOOD_GROUPS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="175" {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="74" {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Tags */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FormLabel>Chronic diseases</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Diabetes"
                  value={tagInput.chronic}
                  onChange={(e) => setTagInput((t) => ({ ...t, chronic: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("chronic", tagInput.chronic))}
                />
                <Button type="button" variant="outline" onClick={() => addTag("chronic", tagInput.chronic)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chronic.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1">
                    {c}
                    <button type="button" onClick={() => setChronic((p) => p.filter((x) => x !== c))} aria-label={`Remove ${c}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>Allergies</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Penicillin"
                  value={tagInput.allergy}
                  onChange={(e) => setTagInput((t) => ({ ...t, allergy: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("allergy", tagInput.allergy))}
                />
                <Button type="button" variant="outline" onClick={() => addTag("allergy", tagInput.allergy)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((a) => (
                  <Badge key={a} variant="destructive" className="gap-1">
                    {a}
                    <button type="button" onClick={() => setAllergies((p) => p.filter((x) => x !== a))} aria-label={`Remove ${a}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your home address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save profile
        </Button>
      </form>
    </Form>
  );
}
