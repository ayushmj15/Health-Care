# 🩺 Health Care: Next-Gen AI Healthcare Platform

An AI-powered, all-in-one healthcare accessibility platform designed to bring medical services, intelligent health insights, and emergency assistance directly to patients. Built with a premium, responsive, and dynamic user interface.

## 🚀 Features

### 🤖 24/7 AI Health Assistant (Powered by Google Gemini)
*   **Symptom Checker:** Instantly ask about symptoms in plain language to get preliminary insights.
*   **Report Analysis:** Upload or ask questions about complex medical reports (blood tests, MRIs) and have the AI explain them in easy-to-understand terms.
*   **Specialist Recommendations:** Get guided suggestions on which type of doctor or specialist to visit based on your queries.

### 🏥 Smart Hospital & Pharmacy Locator
*   **Nationwide Database:** Explore a curated list of top-tier hospitals and medical stores across major cities in India (e.g., AIIMS Delhi, Tata Memorial Mumbai, Apollo Chennai).
*   **Google Maps Integration:** Locate nearby healthcare facilities on an interactive map. Calculates precise distances from your live location.
*   **Advanced Filtering:** Filter by specialties, including Pharmacy, Cardiology, Neurology, Emergency, and more.
*   **Intelligent Directions:** The "Directions" button securely passes the exact hospital name, address, and city to Google Maps, preventing reverse-geocoding errors and ensuring you arrive at the correct entrance.

### 📁 Digital Health Records Vault
*   **Secure Storage:** Upload prescriptions, X-rays, MRI scans, CT scans, and blood reports.
*   **Organized & Searchable:** Keep your entire medical history in one secure, digital location forever.

### 💊 Medicine Reminders
*   **Dosage Tracking:** Log your active medications, dosages, and schedules.
*   **Never Miss a Pill:** Stay on top of your health with organized medication lists and adherence tracking.

### 🚨 One-Tap Emergency SOS
*   **Instant Alerts:** Share your live location immediately in a crisis.
*   **Emergency Contacts:** Instantly notify pre-saved emergency contacts and quickly find the nearest emergency room.

### 🎨 Premium "Awwwards-Winning" UI/UX
*   **Glassmorphism & Deep Dark Mode:** A stunning `#0a0a0a` deep dark mode aesthetic featuring intense background blur, subtle gradient borders, and frosted glass components.
*   **Bento Grid Layouts:** Intuitive, visually striking feature grids featuring radial mouse-tracking glow effects and 3D tilts.
*   **Dynamic Sticky Scrolling:** Smooth, modern scroll animations that change context dynamically as you read.
*   **Magnetic Micro-interactions:** UI buttons that physically react and pull towards the user's cursor for a tactile feel.

## 🛠️ Tech Stack

*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion (GSAP-like scroll effects, sticky scrolls, infinite marquees)
*   **Icons:** Lucide React
*   **AI Engine:** Google Gemini (1.5 Flash)
*   **Mapping:** Google Maps API
*   **Database/Auth:** Supabase

## 📦 Getting Started

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Copy `.env.local.example` to `.env.local` and fill in your keys (Supabase, Google Maps, Gemini).
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚧 Roadmap
*   **Real-time Appointment Booking:** Direct integration with partner hospitals for live slot availability (Currently in development).
*   **Family Sharing:** Manage health records for dependents.