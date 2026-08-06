import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Health Care — AI-Powered Healthcare Platform",
    template: "%s · Health Care",
  },
  description:
    "Health Care is an AI-powered healthcare accessibility platform for booking appointments, managing health records, medicine reminders and 24/7 AI health assistance.",
  keywords: ["healthcare", "appointments", "telemedicine", "AI health assistant", "medical records"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Health Care",
    description: "AI-powered healthcare accessibility platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
