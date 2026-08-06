"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Building2, CalendarDays, Check, ChevronLeft, Clock, Stethoscope, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAppointment, generateTimeSlots } from "@/lib/services/appointments";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations";
import { formatDate, formatTime } from "@/lib/utils";
import type { Doctor, Hospital } from "@/types";

const STEPS = ["Hospital", "Doctor", "Date & time", "Confirm"];

export function BookingFlow({
  userId,
  hospitals,
  doctors,
  initialHospitalId,
  onBooked,
}: {
  userId: string;
  hospitals: Hospital[];
  doctors: Doctor[];
  initialHospitalId?: string;
  onBooked?: () => void;
}) {
  const [step, setStep] = useState(0);

  const form = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      hospitalId: initialHospitalId ?? "",
      doctorId: "",
      date: "",
      time: "",
      type: "in-person",
      reason: "",
    },
  });

  const { watch, setValue } = form;
  const hospitalId = watch("hospitalId");
  const doctorId = watch("doctorId");
  const date = watch("date");

  const selectedHospital = hospitals.find((h) => h.id === hospitalId);
  const availableDoctors = useMemo(
    () => doctors.filter((d) => d.hospital_id === hospitalId),
    [doctors, hospitalId],
  );
  const selectedDoctor = availableDoctors.find((d) => d.id === doctorId);

  const dates = useMemo(() => {
    const out: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push(d.toISOString().split("T")[0]);
    }
    return out;
  }, []);

  const slots = useMemo(
    () =>
      selectedDoctor ? generateTimeSlots(selectedDoctor.available_from ?? "09:00", selectedDoctor.available_to ?? "17:00", [], date) : [],
    [selectedDoctor, date],
  );

  async function onSubmit(values: AppointmentInput) {
    try {
      await createAppointment({
        patient_id: userId,
        hospital_id: values.hospitalId,
        doctor_id: values.doctorId,
        appointment_date: values.date,
        start_time: values.time,
        end_time: addMinutes(values.time, 30),
        type: values.type,
        reason: values.reason,
      });
      toast.success("Appointment booked successfully!");
      form.reset();
      setStep(0);
      onBooked?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not book appointment.");
    }
  }

  function next() {
    if (step === 0 && !hospitalId) return toast.error("Please select a hospital");
    if (step === 1 && !doctorId) return toast.error("Please select a doctor");
    if (step === 2 && !date) return toast.error("Please choose a date");
    if (step === 2 && !form.getValues("time")) return toast.error("Please pick a time slot");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <div className="rounded-2xl border bg-card">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto border-b px-6 py-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? "bg-emerald-500 text-white"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`hidden truncate text-xs font-medium sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <FormField
                control={form.control}
                name="hospitalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose hospital</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);
                        setValue("doctorId", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hospital" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hospitals.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.name} · {h.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedHospital && (
                <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
                  <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{selectedHospital.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedHospital.address}, {selectedHospital.city} · ⭐ {selectedHospital.rating}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedHospital.specialities.slice(0, 5).map((s) => (
                        <Badge key={s} variant="ghost" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {availableDoctors.length === 0 ? (
                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No doctors at this hospital. Go back and choose another.
                </p>
              ) : (
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select doctor</FormLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {availableDoctors.map((d) => (
                          <label
                            key={d.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all hover:border-primary/40 ${
                              field.value === d.id ? "border-primary bg-primary/5 ring-1 ring-primary/30" : ""
                            }`}
                          >
                            <RadioGroupItem value={d.id} className="mt-1" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold">{d.name}</p>
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {d.speciality} · {d.experience_years} yrs exp
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                <span>⭐ {d.rating}</span>
                                <span className="font-medium text-primary">₹{d.fee}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </motion.div>
          )}

          {step === 2 && selectedDoctor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div>
                <FormLabel>Choose a date</FormLabel>
                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {dates.map((d) => {
                    const dateObj = new Date(d);
                    const day = dateObj.toLocaleDateString("en", { weekday: "short" });
                    const num = dateObj.getDate();
                    const active = date === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setValue("date", d);
                          setValue("time", "");
                        }}
                        className={`flex flex-col items-center rounded-xl border py-2.5 text-center transition-all ${
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "hover:border-primary/40 hover:bg-accent"
                        }`}
                      >
                        <span className={`text-[10px] uppercase ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {day}
                        </span>
                        <span className="mt-0.5 text-sm font-bold">{num}</span>
                        <span className={`text-[10px] ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {dateObj.toLocaleDateString("en", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FormLabel className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Available time slots
                </FormLabel>
                {!date ? (
                  <p className="mt-2 text-sm text-muted-foreground">Pick a date above to see slots.</p>
                ) : slots.length === 0 ? (
                  <p className="mt-2 rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No slots available on this date. Try another day.
                  </p>
                ) : (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setValue("time", slot)}
                        className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                          form.getValues("time") === slot
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:border-primary/40 hover:bg-accent"
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-person">
                            <span className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" /> In-person
                            </span>
                          </SelectItem>
                          <SelectItem value="video">
                            <span className="flex items-center gap-2">
                              <Video className="h-4 w-4" /> Video consult
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="text" {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. routine check-up, knee pain…" {...field} />
                      </FormControl>
                      <FormDescription>Helps the doctor prepare for your visit.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && selectedDoctor && selectedHospital && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="rounded-2xl border bg-gradient-to-r from-primary/5 to-teal/5 p-6">
                <p className="text-sm font-semibold text-muted-foreground">Appointment summary</p>
                <h3 className="mt-1 text-xl font-bold">{selectedDoctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.speciality} · {selectedHospital.name}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-card p-3 text-center">
                    <CalendarDays className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-sm font-semibold">{date ? formatDate(date) : "—"}</p>
                  </div>
                  <div className="rounded-xl bg-card p-3 text-center">
                    <Clock className="mx-auto h-5 w-5 text-teal" />
                    <p className="mt-1 text-sm font-semibold">{form.getValues("time") ? formatTime(form.getValues("time")) : "—"}</p>
                  </div>
                  <div className="rounded-xl bg-card p-3 text-center">
                    {form.getValues("type") === "video" ? <Video className="mx-auto h-5 w-5 text-violet-500" /> : <Building2 className="mx-auto h-5 w-5 text-emerald-500" />}
                    <p className="mt-1 text-sm font-semibold capitalize">{form.getValues("type")}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-muted-foreground">Consultation fee</span>
                  <span className="text-lg font-bold">₹{selectedDoctor.fee}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You can cancel this appointment any time before the scheduled slot from your appointments page.
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue →
              </Button>
            ) : (
              <Button type="submit" variant="teal">
                <Check className="h-4 w-4" /> Confirm booking
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m + mins);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
