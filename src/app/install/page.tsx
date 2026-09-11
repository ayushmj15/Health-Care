import type { Metadata } from "next";
import { InstallLanding } from "@/components/pwa/install-landing";

export const metadata: Metadata = {
  title: "Install Health Care",
  description:
    "Install Health Care on your home screen for instant access to appointments, health records, medicine reminders and 24/7 AI assistance.",
};

export default function InstallPage() {
  return <InstallLanding />;
}