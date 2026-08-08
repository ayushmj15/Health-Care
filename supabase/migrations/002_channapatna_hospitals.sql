-- ============================================================================
-- Health Care — Channapatna-area hospitals + emergency contact email
-- Adds real hospitals near Channapatna (Ramanagara district, Karnataka) so
-- distance-based search shows nearby care, plus an email field on
-- emergency contacts for SOS notifications.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Emergency contacts: add optional email for SOS notifications
-- ----------------------------------------------------------------------------
alter table public.emergency_contacts add column if not exists email text;

-- ============================================================================
-- CHANNAPATNA & NEARBY HOSPITALS
-- ============================================================================
insert into public.hospitals (name, slug, description, address, city, state, phone, email, website, latitude, longitude, specialities, services, rating, reviews_count, emergency, image_url, opening_hours)
values
  ('Channapatna Government Taluk Hospital', 'channapatna-govt', 'District-referral taluk hospital serving Channapatna and surrounding villages with 24/7 emergency and maternity care.', 'Taluk Office Road, Channapatna', 'Channapatna', 'Karnataka', '+91 80 2725 2233', 'channapatnagovt@gmail.com', null, 12.6523, 77.2075, ARRAY['General Medicine','Gynecology','Pediatrics','Emergency'], ARRAY['24/7 Emergency','OPD','Ambulance','Maternity','Pharmacy'], 4.0, 210, true, null, '{"Mon-Sun":"00:00-23:59"}'),
  ('Sri Raghavendra Multispeciality Hospital', 'raghavendra-channapatna', 'Private multispeciality hospital on the Bengaluru–Mysuru highway with ICU, diagnostics and emergency care.', 'Bengaluru–Mysuru Road, Kengal', 'Channapatna', 'Karnataka', '+91 80 2725 7788', 'care@raghavendrahospital.in', 'https://raghavendrahospital.in', 12.6520, 77.2080, ARRAY['General Medicine','Orthopedics','Cardiology','Gynecology','Emergency'], ARRAY['24/7 Emergency','ICU','Pharmacy','Diagnostics','Ambulance'], 4.3, 180, true, null, '{"Mon-Sun":"00:00-23:59"}'),
  ('Life Care Hospital Channapatna', 'lifecare-channapatna', 'Community hospital offering OPD, laboratory, pharmacy and vaccination services at affordable rates.', 'MG Road, Channapatna', 'Channapatna', 'Karnataka', '+91 80 2725 4455', 'info@lifecarechannapatna.in', null, 12.6505, 77.2065, ARRAY['General Medicine','Pediatrics','ENT','Dermatology'], ARRAY['OPD','Pharmacy','Lab','Vaccination'], 4.2, 95, false, null, '{"Mon-Sat":"08:00-21:00","Sun":"09:00-13:00"}'),
  ('Ramanagara District Hospital', 'ramanagara-district', 'Government district hospital on NH-275 handling emergency, trauma and maternity cases for the district.', 'NH-275, Ramanagara', 'Ramanagara', 'Karnataka', '+91 80 2727 1122', 'ramanagaradisthosp@gmail.com', null, 12.7237, 77.2840, ARRAY['General Medicine','Gynecology','Orthopedics','Pediatrics','Emergency'], ARRAY['24/7 Emergency','OPD','Maternity','Ambulance','Diagnostics'], 4.1, 340, true, null, '{"Mon-Sun":"00:00-23:59"}'),
  ('Bidadi Multispeciality Hospital', 'bidadi-multispeciality', 'Multispeciality hospital serving the Bidadi industrial area with 24/7 emergency and ICU.', 'Bidadi Industrial Area Road', 'Bidadi', 'Karnataka', '+91 80 2726 3344', 'contact@bidadimultispeciality.in', null, 12.8000, 77.3864, ARRAY['General Medicine','Cardiology','Orthopedics','Gynecology','Emergency'], ARRAY['24/7 Emergency','ICU','Pharmacy','Ambulance','OPD'], 4.4, 260, true, null, '{"Mon-Sun":"00:00-23:59"}'),
  ('Mandya Institute of Medical Sciences', 'mims-mandya', 'Major government teaching hospital serving southern Karnataka with 24/7 emergency and specialist departments.', 'Shivalli, Mandya', 'Mandya', 'Karnataka', '+91 8232 22 5500', 'office@mims.in', 'https://mims.in', 12.5227, 76.8951, ARRAY['General Medicine','Cardiology','Neurology','Orthopedics','Gynecology','Pediatrics','Emergency'], ARRAY['24/7 Emergency','ICU','Ambulance','Maternity','OPD','Diagnostics'], 4.6, 1120, true, null, '{"Mon-Sun":"00:00-23:59"}')
on conflict (slug) do nothing;

-- ============================================================================
-- DOCTORS FOR CHANNAPATNA-AREA HOSPITALS
-- ============================================================================
insert into public.doctors (hospital_id, name, speciality, qualifications, experience_years, fee, rating, bio, available_days, available_from, available_to)
select h.id, d.name, d.speciality, d.qualifications, d.experience_years, d.fee, d.rating, d.bio, string_to_array(d.available_days, ','), d.available_from::time, d.available_to::time
from (
  values
    ('channapatna-govt', 'Dr. Manjunatha Reddy', 'General Medicine', 'MBBS, MD Internal Medicine', 14, 350, 4.4, 'Senior physician at the taluk hospital with 14 years of rural healthcare experience.', 'Mon-Sat', '09:00', '17:00'),
    ('channapatna-govt', 'Dr. Shobha Gowda', 'Gynecology', 'MBBS, DGO', 11, 400, 4.5, 'Obstetrician managing normal and high-risk deliveries at the maternity wing.', 'Mon-Fri', '10:00', '16:00'),
    ('channapatna-govt', 'Dr. Ramesh Kumar', 'Pediatrics', 'MBBS, MD Pediatrics', 9, 350, 4.3, 'Child specialist focusing on immunisation, nutrition and newborn care.', 'Tue,Thu,Sat', '09:30', '15:30'),
    ('raghavendra-channapatna', 'Dr. Anitha Venkatesh', 'General Medicine', 'MBBS, MD Internal Medicine', 12, 500, 4.5, 'General physician treating diabetes, hypertension and infections.', 'Mon-Sat', '09:00', '18:00'),
    ('raghavendra-channapatna', 'Dr. Kiran Kumar', 'Orthopedics', 'MBBS, MS Ortho', 10, 600, 4.4, 'Orthopedic surgeon handling fractures, joint pain and trauma cases.', 'Mon,Wed,Fri,Sat', '10:00', '16:00'),
    ('raghavendra-channapatna', 'Dr. Divya Nagaraj', 'Cardiology', 'MBBS, MD, DM Cardiology', 8, 800, 4.6, 'Cardiologist providing ECG, echo and cardiac risk management.', 'Tue,Thu,Sat', '10:00', '15:00'),
    ('lifecare-channapatna', 'Dr. Poornima H S', 'General Medicine', 'MBBS, DNB Medicine', 7, 400, 4.3, 'Family physician with focus on preventive care and lifestyle diseases.', 'Mon-Sat', '09:00', '19:00'),
    ('lifecare-channapatna', 'Dr. Santosh M', 'ENT', 'MBBS, MS ENT', 8, 500, 4.4, 'ENT specialist treating sinus, ear and throat conditions.', 'Mon-Fri', '10:00', '17:00'),
    ('lifecare-channapatna', 'Dr. Bhavya R', 'Dermatology', 'MBBS, MD Dermatology', 6, 450, 4.2, 'Skin and hair specialist managing acne, eczema and allergies.', 'Wed,Thu,Fri,Sat', '11:00', '17:00'),
    ('ramanagara-district', 'Dr. Vijayalakshmi P', 'General Medicine', 'MBBS, MD Internal Medicine', 15, 350, 4.4, 'District hospital senior physician overseeing emergency and OPD.', 'Mon-Sat', '09:00', '17:00'),
    ('ramanagara-district', 'Dr. Suresh Babu', 'Orthopedics', 'MBBS, MS Ortho', 12, 450, 4.4, 'Orthopedic surgeon managing trauma, fractures and joint disorders.', 'Mon,Wed,Fri', '10:00', '16:00'),
    ('ramanagara-district', 'Dr. Lakshmi Devi', 'Gynecology', 'MBBS, DGO', 13, 400, 4.5, 'Maternity specialist running high-risk pregnancy OPD.', 'Tue,Thu,Sat', '10:00', '15:00'),
    ('bidadi-multispeciality', 'Dr. Chandrashekar N', 'General Medicine', 'MBBS, MD Internal Medicine', 13, 500, 4.5, 'Senior physician treating workers from the industrial area for lifestyle illnesses.', 'Mon-Sat', '09:00', '18:00'),
    ('bidadi-multispeciality', 'Dr. Madhuri K', 'Gynecology', 'MBBS, MS Obstetrics & Gynae', 10, 600, 4.5, 'Obstetrician and gynecologic surgeon with focus on safe motherhood.', 'Mon-Fri', '10:00', '16:00'),
    ('bidadi-multispeciality', 'Dr. Naveen Gowda', 'Cardiology', 'MBBS, MD, DM Cardiology', 9, 800, 4.6, 'Cardiologist specialising in chest pain evaluation and preventive cardiology.', 'Tue,Thu,Sat', '10:00', '15:00'),
    ('mims-mandya', 'Dr. Harish Kumar', 'General Medicine', 'MBBS, MD Internal Medicine', 16, 500, 4.6, 'Professor and senior physician at MIMS with 16 years experience.', 'Mon-Sat', '09:00', '17:00'),
    ('mims-mandya', 'Dr. Rekha B', 'Neurology', 'MBBS, MD, DM Neurology', 12, 900, 4.7, 'Neurologist managing stroke, epilepsy and headache disorders.', 'Mon,Wed,Fri', '09:00', '15:00'),
    ('mims-mandya', 'Dr. Ganesh Prasad', 'Pediatrics', 'MBBS, MD Pediatrics', 11, 500, 4.5, 'Child specialist with NICU expertise and immunisation programs.', 'Tue,Thu,Sat', '10:00', '16:00')
) as d(h_slug, name, speciality, qualifications, experience_years, fee, rating, bio, available_days, available_from, available_to)
join public.hospitals h on h.slug = d.h_slug
on conflict do nothing;
