import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const appointmentSchema = z.object({
  hospitalId: z.string().min(1, "Select a hospital"),
  doctorId: z.string().min(1, "Select a doctor"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time slot"),
  type: z.enum(["in-person", "video"]),
  reason: z.string().optional(),
});

export const medicineSchema = z.object({
  name: z.string().min(2, "Medicine name is required"),
  dosage: z.string().optional(),
  frequency: z.enum(["once_daily", "twice_daily", "three_times_daily", "weekly", "as_needed"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

export const reportSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.enum([
    "prescription",
    "blood_report",
    "xray",
    "mri",
    "ct_scan",
    "vaccination",
    "allergy",
    "medical_history",
    "other",
  ]),
  description: z.string().optional(),
  labName: z.string().optional(),
  reportDate: z.string().min(1, "Report date is required"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  heightCm: z.coerce.number().min(30).max(300).optional().nullable(),
  weightKg: z.coerce.number().min(2).max(400).optional().nullable(),
  chronicDiseases: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  address: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyRelation: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relation: z.string().optional(),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export const hospitalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  specialities: z.array(z.string()).min(1, "Add at least one speciality"),
  emergency: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).default(4.5),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MedicineInput = z.infer<typeof medicineSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type HospitalInput = z.infer<typeof hospitalSchema>;
