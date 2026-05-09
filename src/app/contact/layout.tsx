import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Oatmeal – Calorie Tracker",
  description:
    "Get in touch with the Oatmeal team. Questions, feedback, or partnership inquiries welcome.",
  alternates: { canonical: "https://blogs.lopy.in/contact" },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
