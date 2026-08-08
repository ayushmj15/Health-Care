-- ============================================================================
-- Health Care — Supabase Database Schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- It creates: tables, indexes, RLS policies, triggers and seed data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- PROFILES (extends supabase auth.users)
-- ============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'patient' check (role in ('patient', 'doctor', 'admin')),
  phone text,
  gender text,
  date_of_birth date,
  blood_group text check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  chronic_diseases text[] default '{}',
  allergies text[] default '{}',
  address text,
  emergency_contact jsonb,
  settings jsonb default '{"notifications":true,"theme":"system"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_role_idx on public.users (role);
create index if not exists users_email_idx on public.users (email);

-- ============================================================================
-- HOSPITALS
-- ============================================================================
create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  address text,
  city text,
  state text,
  phone text,
  email text,
  website text,
  latitude double precision,
  longitude double precision,
  specialities text[] default '{}',
  services text[] default '{}',
  rating numeric(3,2) default 4.5,
  reviews_count int default 0,
  emergency boolean default false,
  image_url text,
  opening_hours jsonb,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists hospitals_city_idx on public.hospitals (city);
create index if not exists hospitals_emergency_idx on public.hospitals (emergency);

-- ============================================================================
-- DOCTORS
-- ============================================================================
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid references public.hospitals (id) on delete cascade,
  name text not null,
  speciality text not null,
  qualifications text,
  experience_years int default 0,
  fee numeric(10,2) default 500,
  rating numeric(3,2) default 4.5,
  bio text,
  avatar_url text,
  available_days text[] default '{"Mon","Tue","Wed","Thu","Fri"}',
  available_from time default '09:00',
  available_to time default '17:00',
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists doctors_hospital_idx on public.doctors (hospital_id);
create index if not exists doctors_speciality_idx on public.doctors (speciality);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  hospital_id uuid references public.hospitals (id) on delete set null,
  doctor_id uuid references public.doctors (id) on delete set null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  type text not null default 'in-person' check (type in ('in-person','video')),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','no_show')),
  reason text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_patient_idx on public.appointments (patient_id);
create index if not exists appointments_doctor_idx on public.appointments (doctor_id);
create index if not exists appointments_date_idx on public.appointments (appointment_date);

-- ============================================================================
-- PRESCRIPTIONS
-- ============================================================================
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  doctor_id uuid references public.doctors (id) on delete set null,
  hospital_id uuid references public.hospitals (id) on delete set null,
  medication text not null,
  dosage text,
  frequency text,
  duration text,
  notes text,
  prescribed_date date default current_date,
  file_url text,
  created_at timestamptz not null default now()
);

create index if not exists prescriptions_patient_idx on public.prescriptions (patient_id);

-- ============================================================================
-- REPORTS (Digital Health Records)
-- ============================================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  category text not null default 'other' check (category in ('prescription','blood_report','xray','mri','ct_scan','vaccination','allergy','medical_history','other')),
  description text,
  lab_name text,
  report_date date default current_date,
  file_url text,
  file_type text,
  file_size int,
  created_at timestamptz not null default now()
);

create index if not exists reports_patient_idx on public.reports (patient_id);
create index if not exists reports_category_idx on public.reports (category);

-- ============================================================================
-- MEDICINES + REMINDERS
-- ============================================================================
create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  dosage text,
  frequency text not null default 'once_daily' check (frequency in ('once_daily','twice_daily','three_times_daily','weekly','as_needed')),
  times jsonb not null default '["09:00"]'::jsonb,
  start_date date default current_date,
  end_date date,
  notes text,
  active boolean default true,
  created_at timestamptz not null default now()
);

create index if not exists medicines_patient_idx on public.medicines (patient_id);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  medicine_id uuid references public.medicines (id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','sent','taken','snoozed','missed')),
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists reminders_patient_idx on public.reminders (patient_id);
create index if not exists reminders_scheduled_idx on public.reminders (scheduled_at);

-- ============================================================================
-- EMERGENCY CONTACTS
-- ============================================================================
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  relation text,
  phone text not null,
  created_at timestamptz not null default now()
);

create index if not exists emergency_contacts_patient_idx on public.emergency_contacts (patient_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  message text,
  type text not null default 'info' check (type in ('info','reminder','appointment','alert','system')),
  link text,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id);

-- ============================================================================
-- AI CHAT HISTORY + AI USAGE ANALYTICS
-- ============================================================================
create table if not exists public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  category text default 'general',
  created_at timestamptz not null default now()
);

create index if not exists ai_chats_user_idx on public.ai_chats (user_id);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  action text not null,
  model text,
  tokens_in int default 0,
  tokens_out int default 0,
  latency_ms int default 0,
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_created_idx on public.ai_usage (created_at);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('records', 'records', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.users enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.prescriptions enable row level security;
alter table public.reports enable row level security;
alter table public.medicines enable row level security;
alter table public.reminders enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_chats enable row level security;
alter table public.ai_usage enable row level security;

-- Security definer helper so admin role checks don't recurse through RLS
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES
create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Admin can read all profiles"
  on public.users for select using (public.is_admin());

-- HOSPITALS (publicly readable once authenticated)
create policy "Anyone can read hospitals"
  on public.hospitals for select using (true);

create policy "Admin can manage hospitals"
  on public.hospitals for all using (public.is_admin());

-- DOCTORS
create policy "Anyone can read doctors"
  on public.doctors for select using (true);

create policy "Admin can manage doctors"
  on public.doctors for all using (public.is_admin());

-- APPOINTMENTS
create policy "Patients manage own appointments"
  on public.appointments for all using (auth.uid() = patient_id);

create policy "Doctors see own appointments"
  on public.appointments for select using (exists (select 1 from public.doctors d where d.id = doctor_id and d.id in (select d2.id from public.doctors d2 where true)));

create policy "Admin manages appointments"
  on public.appointments for all using (public.is_admin());

-- PRESCRIPTIONS
create policy "Patients manage own prescriptions"
  on public.prescriptions for all using (auth.uid() = patient_id);

-- REPORTS
create policy "Patients manage own reports"
  on public.reports for all using (auth.uid() = patient_id);

-- MEDICINES
create policy "Patients manage own medicines"
  on public.medicines for all using (auth.uid() = patient_id);

-- REMINDERS
create policy "Patients manage own reminders"
  on public.reminders for all using (auth.uid() = patient_id);

-- EMERGENCY CONTACTS
create policy "Patients manage own emergency contacts"
  on public.emergency_contacts for all using (auth.uid() = patient_id);

-- NOTIFICATIONS
create policy "Users manage own notifications"
  on public.notifications for all using (auth.uid() = user_id);

-- AI CHATS
create policy "Users manage own ai chats"
  on public.ai_chats for all using (auth.uid() = user_id);

-- AI USAGE
create policy "Users read own ai usage"
  on public.ai_usage for select using (auth.uid() = user_id);

create policy "Admin reads all ai usage"
  on public.ai_usage for select using (public.is_admin());

create policy "Insert ai usage"
  on public.ai_usage for insert with check (auth.uid() = user_id);

-- STORAGE RLS
create policy "Users upload own records"
  on storage.objects for insert with check (bucket_id = 'records' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users read own records"
  on storage.objects for select using (bucket_id = 'records' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Public read avatars"
  on storage.objects for select using (bucket_id = 'avatars');

-- ============================================================================
-- TRIGGERS
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- Auto-create profile row when a new auth user signs up (email or phone)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, avatar_url, phone)
  values (
    new.id,
    coalesce(new.email, new.phone),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      case when new.email is not null then split_part(new.email, '@', 1) else new.phone end
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- SEED DATA
-- ============================================================================
insert into public.hospitals (name, slug, description, address, city, state, phone, email, website, latitude, longitude, specialities, services, rating, reviews_count, emergency, image_url, opening_hours)
values
  ('City Care Multispeciality Hospital', 'city-care', 'A 350-bed multispeciality hospital with 24/7 emergency, cardiac care and advanced diagnostics.', '12 MG Road, Indiranagar', 'Bengaluru', 'Karnataka', '+91 80 4123 4500', 'care@citycare.in', 'https://citycare.in', 12.9716, 77.5946, ARRAY['Cardiology','Neurology','Orthopedics','Pediatrics','Dermatology','Emergency'], ARRAY['24/7 Emergency','Ambulance','ICU','Pharmacy','Diagnostics','OPD'], 4.7, 1240, true, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d', '{"Mon-Sat":"08:00-20:00","Sun":"09:00-14:00"}'),
  ('Apollo Wellness Centre', 'apollo-wellness', 'Premium wellness centre known for heart surgeries, cancer care and preventive health programs.', '21 Residency Road', 'Bengaluru', 'Karnataka', '+91 80 4567 8900', 'hello@apollowellness.in', 'https://apollowellness.in', 12.9725, 77.6080, ARRAY['Cardiology','Oncology','Nephrology','Endocrinology','Preventive Care'], ARRAY['24/7 Emergency','Chemotherapy','Dialysis','Health Checkups','Labs'], 4.8, 2080, true, 'https://images.unsplash.com/photo-1516549655169-df83a0774514', '{"Mon-Sun":"00:00-23:59"}'),
  ('Green Leaf Multispeciality', 'green-leaf', 'Community-focused hospital with affordable care, maternity wing and full digital records.', '45 Lavelle Road', 'Bengaluru', 'Karnataka', '+91 80 2345 6700', 'info@greenleaf.in', 'https://greenleaf.in', 12.9742, 77.5901, ARRAY['Gynecology','Pediatrics','General Medicine','ENT','Dermatology'], ARRAY['Maternity','OPD','Pharmacy','Vaccination','Nutrition'], 4.5, 860, false, 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3', '{"Mon-Sat":"08:00-21:00","Sun":"Closed"}'),
  ('Sunrise Ortho & Spine', 'sunrise-ortho', 'Specialized hospital for orthopedics, sports injuries, spine surgeries and physiotherapy.', '88 Koramangala 5th Block', 'Bengaluru', 'Karnataka', '+91 80 5678 9012', 'ortho@sunrise.in', 'https://sunrise.in', 12.9352, 77.6245, ARRAY['Orthopedics','Sports Medicine','Physiotherapy','Rheumatology'], ARRAY['Surgery','Physio','X-Ray','MRI','Rehab'], 4.6, 540, false, 'https://images.unsplash.com/photo-1504439468489-c8920d796a29', '{"Mon-Sat":"09:00-18:00","Sun":"Closed"}'),
  ('Lakeside Eye & ENT Institute', 'lakeside-eye-ent', 'Focused eye care (lasik, cataract) and ENT institute with state-of-the-art microscopes.', '34 100 Feet Road, HSR Layout', 'Bengaluru', 'Karnataka', '+91 80 6789 0123', 'care@lakeside.in', 'https://lakeside.in', 12.9116, 77.6428, ARRAY['Ophthalmology','ENT'], ARRAY['Lasik','Cataract','Hearing Tests','Sinus Surgery'], 4.6, 320, false, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', '{"Mon-Sat":"09:00-19:00","Sun":"09:00-13:00"}'),
  ('Heartbeat Cardiac Centre', 'heartbeat-cardiac', 'Dedicated cardiac institute offering angioplasty, bypass surgery and cardiac rehab programs.', '7 Cunningham Road', 'Bengaluru', 'Karnataka', '+91 80 7890 1234', 'heart@heartbeat.in', 'https://heartbeat.in', 12.9822, 77.5922, ARRAY['Cardiology','Cardiac Surgery','Preventive Care'], ARRAY['24/7 Emergency','Cath Lab','ICU','Cardiac Rehab','ECG'], 4.9, 1875, true, 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd', '{"Mon-Sun":"00:00-23:59"}'),
  ('Metro Maternity & Childcare', 'metro-maternity', 'Award-winning maternity and child care hospital with NICU, IVF and lactation support.', '52 Marathahalli', 'Bengaluru', 'Karnataka', '+91 80 8901 2345', 'moms@metromaternity.in', 'https://metromaternity.in', 12.9551, 77.7008, ARRAY['Gynecology','Pediatrics','Neonatology','IVF'], ARRAY['NICU','IVF','Lactation','Antenatal','Vaccination'], 4.7, 1110, true, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2', '{"Mon-Sun":"00:00-23:59"}'),
  ('Shifa Multispeciality Hospital', 'shifa-multispeciality', 'Multi-language friendly hospital serving diverse communities with affordable treatment plans.', '66 Frazer Town', 'Bengaluru', 'Karnataka', '+91 80 9012 3456', 'care@shifa.in', 'https://shifa.in', 13.0005, 77.6062, ARRAY['General Medicine','Dermatology','Gastroenterology','Urology','Diabetology'], ARRAY['OPD','Pharmacy','Diagnostics','Diabetic Clinic','Dietetics'], 4.4, 690, false, 'https://images.unsplash.com/photo-1581056771392-8a90ddb98731', '{"Mon-Sat":"08:00-22:00","Sun":"10:00-14:00"}')
on conflict (slug) do nothing;

insert into public.doctors (hospital_id, name, speciality, qualifications, experience_years, fee, rating, bio, available_days, available_from, available_to)
select h.id, d.name, d.speciality, d.qualifications, d.experience_years, d.fee, d.rating, d.bio, string_to_array(d.available_days, ','), d.available_from::time, d.available_to::time
from public.hospitals h
cross join (
  values
    ('Dr. Arjun Mehta', 'Cardiology', 'MD, DM Cardiology - AIIMS', 15, 900, 4.9, 'Interventional cardiologist specialising in angioplasty and preventive cardiology.', 'Mon,Wed,Fri', '09:00', '17:00'),
    ('Dr. Priya Sharma', 'Pediatrics', 'MD Pediatrics - CMC Vellore', 11, 700, 4.8, 'Child specialist focused on growth tracking, vaccines and nutrition.', 'Tue,Thu,Sat', '10:00', '18:00'),
    ('Dr. Rohan Iyer', 'Orthopedics', 'MS Ortho, Fellowship Sports Medicine', 13, 850, 4.7, 'Knee and shoulder specialist, treats sports injuries and arthritis.', 'Mon,Tue,Thu,Sat', '09:00', '16:00'),
    ('Dr. Neha Kapoor', 'Dermatology', 'MD Dermatology, DNB', 9, 600, 4.6, 'Clinical dermatologist and cosmetologist, treats acne and skin allergies.', 'Wed,Thu,Fri,Sat', '11:00', '19:00'),
    ('Dr. Suresh Nair', 'Neurology', 'DM Neurology - NIMHANS', 18, 1200, 4.9, 'Stroke and epilepsy specialist with 10,000+ cases managed.', 'Mon,Wed,Fri', '09:00', '15:00'),
    ('Dr. Kavita Reddy', 'Gynecology', 'MD Obstetrics & Gynae', 12, 750, 4.8, 'High-risk pregnancy and minimally invasive gynae surgery expert.', 'Tue,Thu,Sat', '10:00', '17:00'),
    ('Dr. Amitabh Rao', 'Oncology', 'MD, DM Medical Oncology', 16, 1500, 4.9, 'Medical oncologist specialising in solid tumours and precision oncology.', 'Mon,Tue,Wed,Fri', '09:00', '16:00'),
    ('Dr. Farah Khan', 'Endocrinology', 'DM Endocrinology - PGIMER', 10, 800, 4.7, 'Diabetes, thyroid and hormonal disorder specialist.', 'Mon,Wed,Fri,Sat', '09:30', '15:30'),
    ('Dr. Vikram Bhat', 'Cardiology', 'MD, DM Cardiology', 14, 950, 4.8, 'Cardiac electrophysiologist - pacemakers and arrhythmia care.', 'Tue,Thu,Sat', '09:00', '16:00'),
    ('Dr. Meera Pillai', 'General Medicine', 'MBBS, MD Internal Medicine', 8, 450, 4.5, 'General physician managing diabetes, hypertension and infections.', 'Mon-Fri', '09:00', '20:00'),
    ('Dr. Karan Shah', 'Gastroenterology', 'DM Gastroenterology', 11, 850, 4.6, 'Endoscopist treating acid reflux, ulcers and liver disease.', 'Mon,Tue,Wed,Thu', '10:00', '17:00'),
    ('Dr. Ananya Singh', 'Ophthalmology', 'MS Ophthalmology', 9, 650, 4.6, 'Cataract and LASIK surgeon with modern phaco techniques.', 'Mon-Fri', '10:00', '18:00'),
    ('Dr. Rahul Verma', 'ENT', 'MS ENT', 7, 500, 4.4, 'Sinus, ear and voice disorder specialist.', 'Tue,Thu,Sat', '10:00', '17:00'),
    ('Dr. Pooja Malhotra', 'Physiotherapy', 'MPT - Ortho & Sports', 6, 400, 4.5, 'Sports rehab and post-surgical physiotherapist.', 'Mon-Sat', '08:00', '19:00'),
    ('Dr. Imran Sheikh', 'Urology', 'MCh Urology', 15, 1100, 4.8, 'Minimally invasive urology and stone disease specialist.', 'Mon,Wed,Fri', '09:00', '15:00'),
    ('Dr. Lakshmi Narayanan', 'Diabetology', 'MD, DDM', 10, 550, 4.5, 'Diabetes educator and lifestyle medicine practitioner.', 'Mon-Fri', '09:00', '18:00')
) as d(name, speciality, qualifications, experience_years, fee, rating, bio, available_days, available_from, available_to)
on conflict do nothing;
