"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminCreateDoctor } from "@/app/actions";

export function AddDoctorDialog({ hospitals }: { hospitals: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    speciality: "",
    qualifications: "",
    experience_years: "",
    fee: "",
    phone: "",
    whatsapp: "",
    hospital_id: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Doctor name is required.");
      return;
    }
    if (!form.speciality.trim()) {
      toast.error("Speciality is required.");
      return;
    }
    setSaving(true);
    const result = await adminCreateDoctor({
      name: form.name.trim(),
      speciality: form.speciality.trim(),
      qualifications: form.qualifications.trim() || undefined,
      experience_years: Number(form.experience_years) || 0,
      fee: Number(form.fee) || 500,
      phone: form.phone.trim() || undefined,
      whatsapp: form.whatsapp.trim() || undefined,
      hospital_id: form.hospital_id || undefined,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not add doctor.");
      return;
    }
    toast.success("Doctor added.");
    setOpen(false);
    setForm({ name: "", speciality: "", qualifications: "", experience_years: "", fee: "", phone: "", whatsapp: "", hospital_id: "" });
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>Add a doctor to the network and their available speciality.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="d-name">Full name *</Label>
              <Input
                id="d-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Dr. Priya Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-speciality">Speciality *</Label>
              <Input
                id="d-speciality"
                value={form.speciality}
                onChange={(e) => set("speciality", e.target.value)}
                placeholder="Cardiologist"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="d-qualifications">Qualifications</Label>
              <Input id="d-qualifications" value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} placeholder="MD, DM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-exp">Years of experience</Label>
              <Input
                id="d-exp"
                type="number"
                min={0}
                value={form.experience_years}
                onChange={(e) => set("experience_years", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="d-fee">Consultation fee (₹)</Label>
              <Input
                id="d-fee"
                type="number"
                min={0}
                value={form.fee}
                onChange={(e) => set("fee", e.target.value)}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-hospital">Hospital</Label>
              <Select value={form.hospital_id || undefined} onValueChange={(v) => set("hospital_id", v)}>
                <SelectTrigger id="d-hospital">
                  <SelectValue placeholder="Independent" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="d-phone">Phone</Label>
              <Input id="d-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-whatsapp">WhatsApp</Label>
              <Input id="d-whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 …" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Add doctor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}