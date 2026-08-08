import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import { PwaRegister } from "@/components/pwa/pwa-register";

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
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Health Care",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <AppProviders>{children}</AppProviders>
        <Toaster />
        <PwaRegister />
      </body>
    </html>
  );
}
