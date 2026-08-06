import {
  Bot,
  Building2,
  CalendarHeart,
  FolderHeart,
  Home,
  MapPin,
  Pill,
  Siren,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

// ============================================================================
// App-wide constants
// ============================================================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Health Care";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Specialities used across hospital / doctor filtering. */
export const SPECIALITIES = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "Oncology",
  "Endocrinology",
  "Gastroenterology",
  "Ophthalmology",
  "ENT",
  "Urology",
  "Diabetology",
  "General Medicine",
  "Physiotherapy",
  "Psychiatry",
  "Emergency",
] as const;

export const REPORT_CATEGORIES = [
  { value: "blood_report", label: "Blood Report", icon: "droplets" },
  { value: "xray", label: "X-Ray", icon: "scan" },
  { value: "mri", label: "MRI Scan", icon: "brain" },
  { value: "ct_scan", label: "CT Scan", icon: "scan-line" },
  { value: "prescription", label: "Prescription", icon: "file-text" },
  { value: "vaccination", label: "Vaccination Record", icon: "shield-check" },
  { value: "allergy", label: "Allergy", icon: "alert-triangle" },
  { value: "medical_history", label: "Medical History", icon: "history" },
  { value: "other", label: "Other", icon: "folder" },
] as const;

export const MEDICINE_FREQUENCIES = [
  { value: "once_daily", label: "Once a day", times: ["09:00"] },
  { value: "twice_daily", label: "Twice a day", times: ["09:00", "21:00"] },
  { value: "three_times_daily", label: "Three times a day", times: ["08:00", "14:00", "20:00"] },
  { value: "weekly", label: "Weekly", times: ["09:00"] },
  { value: "as_needed", label: "As needed", times: [] },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "bn", label: "বাংলা (Bengali)" },
  { value: "mr", label: "मराठी (Marathi)" },
] as const;

// ============================================================================
// Navigation
// ============================================================================

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home, description: "Your health at a glance" },
  { title: "AI Assistant", href: "/dashboard/assistant", icon: Bot, description: "Ask anything about health" },
  { title: "Find Hospitals", href: "/dashboard/hospitals", icon: MapPin, description: "Locate nearby care" },
  { title: "Appointments", href: "/dashboard/appointments", icon: CalendarHeart, description: "Book & manage visits" },
  { title: "Health Records", href: "/dashboard/records", icon: FolderHeart, description: "Your reports & files" },
  { title: "Medicines", href: "/dashboard/medicines", icon: Pill, description: "Track your medication" },
  { title: "Emergency", href: "/dashboard/emergency", icon: Siren, description: "One-tap SOS help" },
  { title: "Profile", href: "/dashboard/profile", icon: User, description: "Your personal details" },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, description: "Preferences & security" },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  { title: "Overview", href: "/admin", icon: Home },
  { title: "Hospitals", href: "/admin/hospitals", icon: Building2 },
  { title: "Doctors", href: "/admin/doctors", icon: User },
  { title: "Patients", href: "/admin/patients", icon: FolderHeart },
  { title: "Appointments", href: "/admin/appointments", icon: CalendarHeart },
  { title: "Analytics", href: "/admin/analytics", icon: MapPin },
  { title: "AI Usage", href: "/admin/ai-usage", icon: Bot },
  { title: "Reports", href: "/admin/reports", icon: FolderHeart },
];

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#stats", label: "Statistics" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

// ============================================================================
// Landing page content
// ============================================================================

export const STATS = [
  { value: 120, suffix: "K+", label: "Happy patients", icon: "users" },
  { value: 850, suffix: "+", label: "Partner hospitals", icon: "hospital" },
  { value: 2500, suffix: "+", label: "Specialist doctors", icon: "stethoscope" },
  { value: 98, suffix: "%", label: "Satisfaction rate", icon: "heart" },
];

export const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Patient",
    avatar: "AS",
    quote:
      "I booked a cardiology appointment in under a minute and the AI assistant explained my blood report so clearly. This platform genuinely feels like the future of healthcare.",
    rating: 5,
  },
  {
    name: "Rohit Verma",
    role: "Father of two",
    avatar: "RV",
    quote:
      "The medicine reminders have been a lifesaver for my parents. They never miss their evening pills anymore, and the SOS feature gives me real peace of mind.",
    rating: 5,
  },
  {
    name: "Dr. Meera Pillai",
    role: "General Physician",
    avatar: "MP",
    quote:
      "As a doctor, I appreciate how organised the records are. Patients arrive with complete digital histories — it makes consultations far more productive.",
    rating: 5,
  },
  {
    name: "Kavya Nair",
    role: "Patient",
    avatar: "KN",
    quote:
      "The hospital locator with live distance and ratings helped me find the right specialist at 2 AM during an emergency. Incredibly smooth experience.",
    rating: 5,
  },
  {
    name: "Aditya Gupta",
    role: "Caregiver",
    avatar: "AG",
    quote:
      "Managing my mother's multiple health records used to be a mess of paper files. Everything is digital, searchable and beautifully organised now.",
    rating: 4,
  },
  {
    name: "Sana Khan",
    role: "Patient",
    avatar: "SK",
    quote:
      "The dark mode UI is gorgeous and everything is so fast. Video consultations through the platform work flawlessly on my phone.",
    rating: 5,
  },
];

export const FAQS = [
  {
    question: "Is Health Care free to use?",
    answer:
      "Yes! Creating an account, using the AI health assistant, storing your health records and setting medicine reminders are completely free. You only pay for actual doctor consultations at partner hospitals.",
  },
  {
    question: "Can the AI assistant replace a doctor?",
    answer:
      "No. The AI health assistant provides general information, helps you understand symptoms and explains reports — but it is NOT a medical diagnosis and never replaces a qualified doctor. For emergencies, always call your local emergency number.",
  },
  {
    question: "How do you keep my health records private?",
    answer:
      "All records are encrypted in transit and at rest using Supabase with strict row-level security. Only you can view your records — they are never shared with anyone unless you explicitly allow it.",
  },
  {
    question: "Can I book appointments for my family members?",
    answer:
      "Currently each account manages its own records and appointments. A family sharing feature is on our roadmap. For now, we recommend a separate profile per patient.",
  },
  {
    question: "Which hospitals are available on the platform?",
    answer:
      "We have 850+ partner hospitals across major cities. You can also use the hospital locator to find any nearby hospital via Google Maps and book a direct appointment.",
  },
  {
    question: "How do medicine reminders work?",
    answer:
      "After you add a medicine with dosage and timings, we send you push, email and in-app notifications at the scheduled times and track whether you've taken them.",
  },
  {
    question: "Do you support video consultations?",
    answer:
      "Yes. When booking an appointment you can choose between in-person or video consultation with the doctor, depending on availability.",
  },
];

// ============================================================================
// AI Assistant
// ============================================================================

export const AI_DISCLAIMER =
  "This AI assistant provides general health information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider. If you are experiencing a medical emergency, call your local emergency services immediately.";

export const SUGGESTED_QUESTIONS = [
  "I have a headache and fever since morning",
  "Explain my blood report values",
  "How much water should I drink daily?",
  "Suggest a specialist for joint pain",
  "Preventive tips for diabetes",
  "What does my medicine do?",
];
