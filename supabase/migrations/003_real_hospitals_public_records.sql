-- ============================================================================
-- Health Care — Real hospitals, correct websites + public records storage
-- Replaces fictional demo hospitals with real institutions so website and
-- location links actually work. Makes the records bucket public and backfills
-- stored report file paths to full public URLs (fixes 404 on file open).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Correct websites for real regional hospitals
-- ----------------------------------------------------------------------------
update public.hospitals
set website = 'https://mims.karnataka.gov.in/english'
where slug = 'mims-mandya';

update public.hospitals
set website = 'https://ramanagara.nic.in/en/divisions/health-department/'
where slug in ('channapatna-govt', 'ramanagara-district');

-- ----------------------------------------------------------------------------
-- 2. Replace the 8 fictional Bengaluru hospitals with real ones
-- ----------------------------------------------------------------------------
update public.hospitals
set name = 'Apollo Hospitals',
    slug = 'apollo-hospitals-bannerghatta',
    description = 'One of India''s largest private hospital networks on Bannerghatta Road — cardiac sciences, oncology, transplants and 24/7 emergency.',
    address = '154/11, Bannerghatta Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 4182 1000',
    email = 'care@apollohospitals.com',
    website = 'https://www.apollohospitals.com/bengaluru/',
    latitude = 12.8894,
    longitude = 77.6047,
    specialities = ARRAY['Cardiology','Oncology','Neurology','Nephrology','General Medicine','Emergency'],
    services = ARRAY['24/7 Emergency','ICU','Ambulance','Pharmacy','Diagnostics','Health Checkups'],
    rating = 4.8,
    reviews_count = 2500,
    emergency = true
where slug = 'apollo-wellness';

update public.hospitals
set name = 'Fortis Hospital',
    slug = 'fortis-hospital-cunningham-road',
    description = 'Tertiary care hospital on Cunningham Road with cardiac sciences, neurology and advanced emergency care.',
    address = '154/9, Opposite IIM, Cunningham Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 4114 4114',
    email = 'bengaluru@fortishealthcare.com',
    website = 'https://www.fortishealthcare.com/pan-india/hospitals/fortis-hospital-cunningham-road',
    latitude = 12.9815,
    longitude = 77.5965,
    specialities = ARRAY['Cardiology','Neurology','Orthopedics','Nephrology','Gastroenterology','Emergency'],
    services = ARRAY['24/7 Emergency','ICU','Cath Lab','Ambulance','Pharmacy','Diagnostics'],
    rating = 4.7,
    reviews_count = 1980,
    emergency = true
where slug = 'city-care';

update public.hospitals
set name = 'Manipal Hospital',
    slug = 'manipal-hospital-old-airport-road',
    description = 'Multi-speciality hospital on Old Airport Road — comprehensive care across cardiac, orthopedics, women and child health.',
    address = '98, HAL Airport Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 2502 4444',
    email = 'info@manipalhospitals.com',
    website = 'https://www.manipalhospitals.com/oldairportroad/',
    latitude = 12.9614,
    longitude = 77.6560,
    specialities = ARRAY['Cardiology','Orthopedics','Neurology','Gynecology','Pediatrics','General Medicine'],
    services = ARRAY['24/7 Emergency','ICU','OPD','Pharmacy','Diagnostics','Maternity'],
    rating = 4.6,
    reviews_count = 1750,
    emergency = true
where slug = 'green-leaf';

update public.hospitals
set name = 'Sparsh Hospital',
    slug = 'sparsh-hospital-bannerghatta',
    description = 'Specialist centre for orthopedics, spine surgery, sports medicine and physiotherapy on Bannerghatta Road.',
    address = '14, 100 Feet Road, Bannerghatta Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 4659 9999',
    email = 'contact@sparshhospital.com',
    website = 'https://www.sparshhospital.com/',
    latitude = 12.9205,
    longitude = 77.5885,
    specialities = ARRAY['Orthopedics','Spine Surgery','Sports Medicine','Rheumatology','Physiotherapy'],
    services = ARRAY['Surgery','Physiotherapy','X-Ray','MRI','Rehab','Emergency'],
    rating = 4.6,
    reviews_count = 720,
    emergency = true
where slug = 'sunrise-ortho';

update public.hospitals
set name = 'Narayana Health City',
    slug = 'narayana-health-city',
    description = 'One of the world''s largest cardiac care centres at Bommasandra — cardiac surgery, neurology and organ transplants.',
    address = '#258/A, Bommasandra Industrial Area, Hosur Road',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 7122 2222',
    email = 'contact@narayanahealth.org',
    website = 'https://www.narayanahealth.org/',
    latitude = 12.8370,
    longitude = 77.6608,
    specialities = ARRAY['Cardiology','Cardiac Surgery','Neurology','Nephrology','Transplant Surgery','Emergency'],
    services = ARRAY['24/7 Emergency','Cath Lab','ICU','Ambulance','Pharmacy','Diagnostics'],
    rating = 4.9,
    reviews_count = 3100,
    emergency = true
where slug = 'heartbeat-cardiac';

update public.hospitals
set name = 'Narayana Nethralaya',
    slug = 'narayana-nethralaya',
    description = 'Pioneering eye care institute specialising in retina, cataract, LASIK and neuro-ophthalmology.',
    address = '121, Chowdeshwari Layout, 1st R Block, Rajajinagar',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 6612 3737',
    email = 'info@narayananethralaya.com',
    website = 'https://www.narayananethralaya.com/',
    latitude = 12.9674,
    longitude = 77.5385,
    specialities = ARRAY['Ophthalmology','Retina','Neuro-Ophthalmology'],
    services = ARRAY['Cataract','Lasik','Retina Clinic','Diagnostics','OPD'],
    rating = 4.7,
    reviews_count = 890,
    emergency = false
where slug = 'lakeside-eye-ent';

update public.hospitals
set name = 'Motherhood Hospitals',
    slug = 'motherhood-hospitals-indiranagar',
    description = 'Maternity, women and child care hospital with NICU, IVF and lactation support at Indiranagar.',
    address = 'No. 542, 1st Floor, 100 Feet Road, Indiranagar',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 4668 2600',
    email = 'care@motherhoodhospitals.com',
    website = 'https://www.motherhoodhospitals.com/',
    latitude = 12.9719,
    longitude = 77.6412,
    specialities = ARRAY['Obstetrics','Gynecology','Pediatrics','Neonatology','IVF'],
    services = ARRAY['NICU','IVF','Maternity','Lactation','Vaccination','OPD'],
    rating = 4.5,
    reviews_count = 1240,
    emergency = true
where slug = 'metro-maternity';

update public.hospitals
set name = 'Aster CMI Hospital',
    slug = 'aster-cmi-hospital-hebbal',
    description = 'Multi-speciality quaternary care hospital at Hebbal — cardiac, neurosciences, orthopedics and liver care.',
    address = 'No. 43/2, NH-44, Hebbal',
    city = 'Bengaluru',
    state = 'Karnataka',
    phone = '+91 80 4342 1000',
    email = 'ask@asterhospitals.in',
    website = 'https://www.asterhospitals.in/aster-cmi-hebbal',
    latitude = 13.0333,
    longitude = 77.5975,
    specialities = ARRAY['Cardiology','Neurosciences','Orthopedics','Gastroenterology','Transplant Surgery','Emergency'],
    services = ARRAY['24/7 Emergency','ICU','Ambulance','Pharmacy','Diagnostics','Health Checkups'],
    rating = 4.6,
    reviews_count = 1620,
    emergency = true
where slug = 'shifa-multispeciality';

-- ----------------------------------------------------------------------------
-- 3. Make the records storage bucket public (fixes 404 on file open)
-- ----------------------------------------------------------------------------
update storage.buckets
set public = true
where id = 'records';

-- ----------------------------------------------------------------------------
-- 4. Backfill stored report file paths to full public URLs
-- ----------------------------------------------------------------------------
update public.reports
set file_url = 'https://uauvrgyuuvzlfkzlxfax.supabase.co/storage/v1/object/public/records/' || file_url
where file_url is not null
  and file_url <> ''
  and file_url not like 'http%';
