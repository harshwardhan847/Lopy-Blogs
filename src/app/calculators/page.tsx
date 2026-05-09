import type { Metadata } from "next";
import TDEECalculator from "@/components/calculators/TDEECalculator";
import BMRCalculator from "@/components/calculators/BMRCalculator";
import MacroCalculator from "@/components/calculators/MacroCalculator";
import BMICalculator from "@/components/calculators/BMICalculator";
import InContentAd from "@/components/ads/InContentAd";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Free Health Calculators – TDEE, BMR, Macros, BMI | Oatmeal",
  description:
    "Free nutrition and fitness calculators: TDEE, BMR, Macro, and BMI. Get personalized calorie and macro targets instantly.",
  alternates: { canonical: "https://blogs.lopy.in/calculators" },
  openGraph: {
    title: "Free Health Calculators – TDEE, BMR, Macros, BMI | Oatmeal",
    description: "Calculate your TDEE, BMR, macros, and BMI for free.",
    url: "https://blogs.lopy.in/calculators",
    siteName: "Oatmeal – Calorie Tracker",
    type: "website",
  },
};

const CALC_LINKS = [
  {
    slug: "tdee-calculator",
    label: "TDEE Calculator",
    desc: "Total daily energy expenditure",
  },
  {
    slug: "bmr-calculator",
    label: "BMR Calculator",
    desc: "Basal metabolic rate",
  },
  {
    slug: "macro-calculator",
    label: "Macro Calculator",
    desc: "Protein, carbs & fat targets",
  },
  { slug: "bmi-calculator", label: "BMI Calculator", desc: "Body mass index" },
];

export default function CalculatorsHubPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-12 px-4 text-center bg-background">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground tracking-tight">
          Free Health Calculators
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-muted-foreground">
          Get personalized TDEE, BMR, macro, and BMI results instantly. No
          sign-up required.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {CALC_LINKS.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="text-sm font-medium px-4 py-2 rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Calculators */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <TDEECalculator />
        <InContentAd type="custom" />
        <BMRCalculator />
        <MacroCalculator />
        <InContentAd type="none" />
        <BMICalculator />

        {/* Calculator cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
            All Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CALC_LINKS.map((c) => (
              <Link key={c.slug} href={`/calculators/${c.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 bg-primary/10">
                      🧮
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {c.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
