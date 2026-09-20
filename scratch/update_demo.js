
const fs = require('fs');
let code = fs.readFileSync('src/lib/demo-data.ts', 'utf8');

const newHospitals = \export const DEMO_HOSPITALS: Hospital[] = [
  {
    id: 'h1', name: 'Fortis Hospital', slug: 'fortis-hospital-cunningham-road', description: 'Tertiary care hospital.',
    address: '14, Cunningham Road', city: 'Bengaluru', state: 'Karnataka', phone: '+91 80 4114 4114', email: 'info@fortis.com', website: 'https://fortishealthcare.com',
    latitude: 12.9883, longitude: 77.5944, specialities: ['Cardiology', 'Neurology', 'Orthopedics'], services: ['Emergency', 'ICU'],
    rating: 4.7, reviews_count: 1240, emergency: true, image_url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Fortis+Hospital', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h2', name: 'AIIMS Delhi', slug: 'aiims-new-delhi', description: 'All India Institute of Medical Sciences.',
    address: 'Ansari Nagar', city: 'New Delhi', state: 'Delhi', phone: '+91 11 2658 8500', email: 'info@aiims.edu', website: 'https://aiims.edu',
    latitude: 28.5659, longitude: 77.2093, specialities: ['Cardiology', 'Neurology', 'Oncology', 'Emergency'], services: ['24/7 Emergency', 'OPD'],
    rating: 4.9, reviews_count: 5200, emergency: true, image_url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=AIIMS+Delhi', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h3', name: 'Tata Memorial Hospital', slug: 'tata-memorial-mumbai', description: 'Specialist cancer treatment and research centre.',
    address: 'Dr. E Borges Road, Parel', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 2417 7000', email: 'info@tmc.gov.in', website: 'https://tmc.gov.in',
    latitude: 19.0049, longitude: 72.8407, specialities: ['Oncology', 'Radiotherapy'], services: ['Chemotherapy', 'Surgery'],
    rating: 4.8, reviews_count: 3100, emergency: true, image_url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Tata+Memorial', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h4', name: 'Apollo Hospitals Greams Road', slug: 'apollo-chennai', description: 'Flagship hospital of Apollo group.',
    address: '21, Greams Lane, Off Greams Road', city: 'Chennai', state: 'Tamil Nadu', phone: '+91 44 2829 3333', email: 'info@apollohospitals.com', website: 'https://apollohospitals.com',
    latitude: 13.0604, longitude: 80.2496, specialities: ['Cardiology', 'Orthopedics', 'Emergency'], services: ['24/7 Emergency', 'Diagnostics'],
    rating: 4.7, reviews_count: 4200, emergency: true, image_url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Apollo+Chennai', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h5', name: 'Apollo Pharmacy', slug: 'apollo-pharmacy-delhi', description: '24/7 Pharmacy store offering all medicines.',
    address: 'Connaught Place', city: 'New Delhi', state: 'Delhi', phone: '+91 11 2341 1234', email: 'pharma@apollo.com', website: 'https://apollopharmacy.in',
    latitude: 28.6315, longitude: 77.2167, specialities: ['Pharmacy', 'Medical Store'], services: ['Medicines', 'Home Delivery'],
    rating: 4.5, reviews_count: 850, emergency: false, image_url: 'https://placehold.co/600x400/10b981/ffffff?text=Apollo+Pharmacy', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h6', name: 'MedPlus Medical Store', slug: 'medplus-bengaluru', description: 'Retail pharmacy chain offering discounts.',
    address: 'Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka', phone: '+91 80 1234 5678', email: 'care@medplus.com', website: 'https://medplusmart.com',
    latitude: 12.9784, longitude: 77.6408, specialities: ['Pharmacy', 'Medical Store'], services: ['Medicines', 'Health Products'],
    rating: 4.4, reviews_count: 620, emergency: false, image_url: 'https://placehold.co/600x400/10b981/ffffff?text=MedPlus', opening_hours: { 'Mon-Sat': '08:00-22:00' }, is_active: true,
  },
  {
    id: 'h7', name: 'Christian Medical College', slug: 'cmc-vellore', description: 'Renowned hospital and medical college.',
    address: 'Ida Scudder Road', city: 'Vellore', state: 'Tamil Nadu', phone: '+91 416 228 1000', email: 'info@cmcvellore.ac.in', website: 'https://cmcvellore.ac.in',
    latitude: 12.9244, longitude: 79.1353, specialities: ['General Medicine', 'Cardiology', 'Neurology', 'Emergency'], services: ['24/7 Emergency', 'OPD'],
    rating: 4.8, reviews_count: 3800, emergency: true, image_url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=CMC+Vellore', opening_hours: { 'Mon-Sun': '00:00-23:59' }, is_active: true,
  },
  {
    id: 'h8', name: 'Wellness Pharmacy', slug: 'wellness-pharmacy-mumbai', description: 'Neighborhood pharmacy store.',
    address: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 9876 5432', email: 'info@wellness.com', website: 'https://wellness.com',
    latitude: 19.0596, longitude: 72.8295, specialities: ['Pharmacy', 'Medical Store'], services: ['Medicines', 'Vitamins'],
    rating: 4.3, reviews_count: 150, emergency: false, image_url: 'https://placehold.co/600x400/10b981/ffffff?text=Wellness+Pharmacy', opening_hours: { 'Mon-Sun': '09:00-22:00' }, is_active: true,
  }
];\;

code = code.replace(/export const DEMO_HOSPITALS: Hospital\\[\\] = \\[[\\s\\S]*?\\];/, newHospitals);
fs.writeFileSync('src/lib/demo-data.ts', code);
console.log('Updated DEMO_HOSPITALS in demo-data.ts');

