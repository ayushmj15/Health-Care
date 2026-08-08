"use client";

import { Loader2, Phone, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addEmergencyContact, deleteEmergencyContact } from "@/lib/services/profile";
import type { EmergencyContact } from "@/types";

const MAX_CONTACTS = 3;

/**
 * Emergency contacts manager shown on the profile page.
 * Every contact here is notified when SOS is triggered.
 */
export function EmergencyContactsSection({
  patientId,
  initial,
  onChange,
}: {
  patientId: string;
  initial: EmergencyContact[];
  onChange?: (contacts: EmergencyContact[]) => void;
}) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initial);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "", phone: "", email: "" });

  function updateContacts(next: EmergencyContact[]) {
    setContacts(next);
    onChange?.(next);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Name and phone are required");
    setSaving(true);
    try {
      const created = await addEmergencyContact({
        patient_id: patientId,
        name: form.name,
        relation: form.relation || null,
        phone: form.phone,
        email: form.email || null,
      });
      updateContacts([...contacts, created]);
      setAddOpen(false);
      setForm({ name: "", relation: "", phone: "", email: "" });
      toast.success("Emergency contact added.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add contact.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const next = contacts.filter((c) => c.id !== id);
    updateContacts(next);
    try {
      await deleteEmergencyContact(id);
      toast.success("Contact removed.");
    } catch {
      // demo mode — ignore
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Emergency contacts</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddOpen(true)}
          disabled={contacts.length >= MAX_CONTACTS}
        >
          <Plus className="h-4 w-4" /> Add contact
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {contacts.length}/{MAX_CONTACTS} — every contact here receives your SOS alert with your live location.
      </p>

      {contacts.length === 0 ? (
        <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
          No emergency contacts yet. Add family or friends so SOS can reach them.
        </p>
      ) : (
        <div className="space-y-2.5">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.relation ?? "Contact"} · {c.phone}
                  {c.email ? ` · ${c.email}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button size="iconSm" variant="outline" asChild>
                  <a href={`tel:${c.phone.replace(/\D/g, "")}`} aria-label={`Call ${c.name}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="iconSm" variant="ghost" onClick={() => remove(c.id)} aria-label="Remove contact">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add emergency contact</DialogTitle>
            <DialogDescription>They will be alerted via WhatsApp and email when you trigger SOS.</DialogDescription>
          </DialogHeader>
          <form onSubmit={add} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Johnson" />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <Input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="e.g. Wife" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" inputMode="tel" />
            </div>
            <div className="space-y-2">
              <Label>Email (optional)</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@example.com" type="email" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
