// ============================================================================
// Shared domain types for Health Care
// ============================================================================

export type Role = "patient" | "doctor" | "admin";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: BloodGroup | null;
  height_cm: number | null;
  weight_kg: number | null;
  chronic_diseases: string[];
  allergies: string[];
  address: string | null;
  emergency_contact: {
    name?: string;
    relation?: string;
    phone?: string;
  } | null;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
  two_factor: boolean;
  share_emergency: boolean;
  privacy: "private" | "family" | "doctor";
}

export interface Hospital {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  specialities: string[];
  services: string[];
  rating: number;
  reviews_count: number;
  emergency: boolean;
  image_url: string | null;
  opening_hours: Record<string, string> | null;
  is_active: boolean;
}

export interface Doctor {
  id: string;
  hospital_id: string | null;
  hospital?: Hospital | null;
  name: string;
  speciality: string;
  qualifications: string | null;
  experience_years: number;
  fee: number;
  rating: number;
  bio: string | null;
  avatar_url: string | null;
  available_days: string[];
  available_from: string | null;
  available_to: string | null;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  patient_id: string;
  hospital_id: string | null;
  doctor_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  type: "in-person" | "video";
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  created_at: string;
  doctor?: Doctor | null;
  hospital?: Hospital | null;
}

export type ReportCategory =
  | "prescription"
  | "blood_report"
  | "xray"
  | "mri"
  | "ct_scan"
  | "vaccination"
  | "allergy"
  | "medical_history"
  | "other";

export interface Report {
  id: string;
  patient_id: string;
  title: string;
  category: ReportCategory;
  description: string | null;
  lab_name: string | null;
  report_date: string;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  hospital_id: string | null;
  medication: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  notes: string | null;
  prescribed_date: string;
  file_url: string | null;
  doctor?: Doctor | null;
}

export type MedicineFrequency = "once_daily" | "twice_daily" | "three_times_daily" | "weekly" | "as_needed";

export interface Medicine {
  id: string;
  patient_id: string;
  name: string;
  dosage: string | null;
  frequency: MedicineFrequency;
  times: string[];
  start_date: string;
  end_date: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  medicine_id: string | null;
  scheduled_at: string;
  status: "pending" | "sent" | "taken" | "snoozed" | "missed";
  taken_at: string | null;
  medicine?: Medicine | null;
}

export interface EmergencyContact {
  id: string;
  patient_id: string;
  name: string;
  relation: string | null;
  phone: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: "info" | "reminder" | "appointment" | "alert" | "system";
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  category?: string;
  created_at: string;
}

export interface AiUsage {
  id: string;
  user_id: string | null;
  action: string;
  model: string | null;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
  created_at: string;
}

/** Dashboard analytics payload (used by admin charts). */
export interface AnalyticsData {
  totalPatients: number;
  totalDoctors: number;
  totalHospitals: number;
  totalAppointments: number;
  revenue: number;
  appointmentsTrend: { month: string; appointments: number }[];
  patientGrowth: { month: string; patients: number }[];
  specialityDistribution: { name: string; value: number }[];
  aiUsage: { action: string; tokens_in: number; tokens_out: number; count: number }[];
  statusDistribution: { status: string; count: number }[];
}
