import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Oatmeal – Calorie Tracker",
  description:
    "Privacy Policy for the Oatmeal calorie tracker app and website. We respect your privacy and explain how data is handled.",
  alternates: { canonical: "https://oatmealapp.com/privacy-policy" },
};

const EFFECTIVE_DATE = "January 1, 2025";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1
        className="text-4xl font-bold mb-2"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
        }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--color-muted)" }}>
        Effective: {EFFECTIVE_DATE}
      </p>

      <div className="space-y-8 text-sm" style={{ color: "var(--color-text)" }}>
        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            1. Introduction
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Oatmeal ("we", "us", "our") operates the website oatmealapp.com and
            the Oatmeal calorie tracker app. This Privacy Policy explains what
            information we collect, how we use it, and your rights regarding
            that information.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            2. Information We Collect
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            <strong>Website analytics:</strong> We use Google Analytics to
            collect anonymized data about how visitors use the site — pages
            viewed, time on site, and traffic sources. No personally
            identifiable information is collected.
          </p>
          <p className="mt-2" style={{ color: "var(--color-muted)" }}>
            <strong>Cookies:</strong> This site uses cookies for analytics and
            advertising (Google AdSense, if enabled). You can opt out via your
            browser settings or the Google Ads settings at
            adssettings.google.com.
          </p>
          <p className="mt-2" style={{ color: "var(--color-muted)" }}>
            <strong>Contact information:</strong> If you contact us via the
            contact form, we collect your name and email address solely to
            respond to your inquiry.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            3. How We Use Information
          </h2>
          <ul
            className="list-disc pl-5 space-y-1"
            style={{ color: "var(--color-muted)" }}
          >
            <li>To understand site usage and improve content quality.</li>
            <li>To serve relevant ads via Google AdSense (if enabled).</li>
            <li>To respond to support requests.</li>
          </ul>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            4. Third-Party Services
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            We use the following third-party services that may collect data
            under their own privacy policies:
          </p>
          <ul
            className="list-disc pl-5 mt-2 space-y-1"
            style={{ color: "var(--color-muted)" }}
          >
            <li>
              <strong>Google Analytics</strong> —{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google AdSense</strong> —{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                Google Ads Policy
              </a>
            </li>
            <li>
              <strong>Vercel</strong> (site hosting) —{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                Vercel Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            5. Data Retention
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Analytics data is retained for 14 months in Google Analytics (the
            default). Contact form submissions are deleted after we respond. We
            do not store sensitive personal data on our servers.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            6. Your Rights
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            Depending on your location, you may have the right to access,
            correct, or delete personal data we hold about you. To exercise
            these rights, contact us at the email below.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            7. Children's Privacy
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            This website is not directed at children under 13. We do not
            knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            8. Changes to This Policy
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            9. Contact Us
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            For privacy questions or requests, email us via our{" "}
            <a href="/contact" style={{ color: "var(--color-primary)" }}>
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
