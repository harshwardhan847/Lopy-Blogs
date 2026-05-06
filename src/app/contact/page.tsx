"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Replace with your actual form endpoint (e.g. Formspree, Resend, etc.)
    try {
      // Placeholder — wire up to your form backend
      await new Promise((res) => setTimeout(res, 800));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold mb-2 text-foreground tracking-tight">
        Contact Us
      </h1>
      <p className="text-sm mb-10 text-muted-foreground">
        Have a question, feedback, or partnership inquiry? We read every
        message.
      </p>

      {status === "sent" ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="font-bold text-lg mb-2 text-foreground">
              Message sent!
            </h2>
            <p className="text-sm text-muted-foreground">
              We’ll get back to you within 48 hours.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                >
                  Message
                </Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What’s on your mind?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              {status === "error" && (
                <p className="text-xs text-red-500">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
