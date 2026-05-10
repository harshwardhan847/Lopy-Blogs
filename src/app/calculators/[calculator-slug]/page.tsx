import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { buildCalculatorMetadata } from "@/lib/seo";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import FAQSchema from "@/components/shared/FAQSchema";
import TDEECalculator from "@/components/calculators/TDEECalculator";
import BMRCalculator from "@/components/calculators/BMRCalculator";
import MacroCalculator from "@/components/calculators/MacroCalculator";
import BMICalculator from "@/components/calculators/BMICalculator";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ "calculator-slug": string }>;
}

const SLUGS = [
  "tdee-calculator",
  "bmr-calculator",
  "macro-calculator",
  "bmi-calculator",
];

export function generateStaticParams() {
  return SLUGS.map((s) => ({ "calculator-slug": s }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { "calculator-slug": slug } = await params;
  return buildCalculatorMetadata(slug);
}

interface CalcConfig {
  title: string;
  subtitle: string;
  description: string;
  component: React.ReactNode;
  faqs: { question: string; answer: string }[];
}

function getConfig(slug: string): CalcConfig | null {
  switch (slug) {
    case "tdee-calculator":
      return {
        title: "TDEE Calculator",
        subtitle: "Total Daily Energy Expenditure",
        description:
          "Your TDEE is the total number of calories you burn per day including exercise and daily activity. Use it to set accurate calorie goals.",
        component: <TDEECalculator />,
        faqs: [
          {
            question: "What is TDEE?",
            answer:
              "TDEE stands for Total Daily Energy Expenditure — the total calories your body burns in a day, including physical activity.",
          },
          {
            question: "How do I use my TDEE to lose weight?",
            answer:
              "To lose weight, eat 300–500 calories below your TDEE per day. This creates a sustainable deficit without excessive muscle loss.",
          },
          {
            question: "What formula does this calculator use?",
            answer:
              "BMR is calculated using the Mifflin-St Jeor equation, then multiplied by an activity multiplier to get TDEE.",
          },
          {
            question: "How often should I recalculate my TDEE?",
            answer:
              "Recalculate every 4–6 weeks or when your weight changes by more than 5kg, as your calorie needs change with body composition.",
          },
        ],
      };
    case "bmr-calculator":
      return {
        title: "BMR Calculator",
        subtitle: "Basal Metabolic Rate",
        description:
          "Your BMR is the number of calories your body burns at complete rest. It accounts for basic functions like breathing, circulation, and cell repair.",
        component: <BMRCalculator />,
        faqs: [
          {
            question: "What is BMR?",
            answer:
              "Basal Metabolic Rate (BMR) is the minimum number of calories your body needs at complete rest to maintain vital functions.",
          },
          {
            question: "What is the Mifflin-St Jeor equation?",
            answer:
              "It is the most widely validated formula for calculating BMR: For men: (10 × weight) + (6.25 × height) − (5 × age) + 5. For women: same − 161.",
          },
          {
            question: "What is the difference between BMR and TDEE?",
            answer:
              "BMR is your resting calorie burn. TDEE includes activity on top of BMR and is what you should base your diet on.",
          },
          {
            question: "Can my BMR change over time?",
            answer:
              "Yes. BMR decreases with age and when you lose significant weight, but can increase with more muscle mass.",
          },
        ],
      };
    case "macro-calculator":
      return {
        title: "Macro Calculator",
        subtitle: "Protein, Carbs & Fat Targets",
        description:
          "Calculate your daily macro targets — protein, carbohydrates, and fat — based on your total calorie goal and fitness objective.",
        component: <MacroCalculator />,
        faqs: [
          {
            question: "What are macros?",
            answer:
              "Macronutrients (macros) are the three main nutrient categories: protein, carbohydrates, and fat. They provide all dietary calories.",
          },
          {
            question: "How much protein should I eat to build muscle?",
            answer:
              "Aim for 1.6–2.2g of protein per kg of body weight daily to support muscle protein synthesis.",
          },
          {
            question: "What macro split is best for weight loss?",
            answer:
              "A higher-protein split (around 35% protein, 35% carbs, 30% fat) is effective for preserving muscle while losing fat.",
          },
          {
            question: "How many calories are in each macro?",
            answer:
              "Protein and carbohydrates both contain 4 calories per gram. Fat contains 9 calories per gram.",
          },
        ],
      };
    case "bmi-calculator":
      return {
        title: "BMI Calculator",
        subtitle: "Body Mass Index",
        description:
          "Calculate your Body Mass Index (BMI) to understand whether your weight is in a healthy range for your height.",
        component: <BMICalculator />,
        faqs: [
          {
            question: "What is a healthy BMI?",
            answer:
              "A BMI of 18.5–24.9 is considered normal weight. Below 18.5 is underweight; 25–29.9 is overweight; 30+ is obese.",
          },
          {
            question: "Is BMI an accurate measure of health?",
            answer:
              "BMI is a useful screening tool but does not distinguish between muscle and fat. Athletes may have a high BMI but low body fat.",
          },
          {
            question: "How is BMI calculated?",
            answer:
              "BMI = weight (kg) ÷ height² (m²). For example, 70kg ÷ (1.70m × 1.70m) = 24.2.",
          },
          {
            question: "What should I do if my BMI is in the overweight range?",
            answer:
              "Consult a healthcare provider. Lifestyle changes like a calorie-controlled diet and regular exercise can help. The Oatmeal app can help you track.",
          },
        ],
      };
    default:
      return null;
  }
}

export default async function CalculatorDetailPage({ params }: PageProps) {
  const { "calculator-slug": slug } = await params;
  const config = getConfig(slug);
  if (!config) notFound();

  const otherCalcs = SLUGS.filter((s) => s !== slug);

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: config.title, href: `/calculators/${slug}` },
        ]}
      />
      <FAQSchema items={config.faqs} />

      {/* Hero */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs mb-4 flex gap-1 flex-wrap text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/calculators" className="hover:text-primary">
              Calculators
            </Link>
            <span>/</span>
            <span>{config.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-foreground">
            {config.title}
          </h1>
          <p className="text-base text-muted-foreground">{config.subtitle}</p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main */}
          <div className="lg:col-span-2 space-y-8">
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>

            {config.component}

            <InContentAd type="custom" />

            {/* FAQ */}
            <section>
              <h2 className="font-bold text-xl mb-5 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {config.faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2 text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <SidebarAd type="custom" />

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Track Results Free
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Download Oatmeal to log meals, track macros, and hit your
                  calorie goals automatically.
                </p>
                <a
                  href="https://apps.apple.com/app/oatmeal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "w-full text-sm")}
                >
                  Download Free
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Other Calculators
                </h3>
                <ul className="space-y-2 text-sm">
                  {otherCalcs.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/calculators/${s}`}
                        className="text-primary hover:underline capitalize"
                      >
                        {s
                          .replace(/-/g, " ")
                          .replace("calculator", "Calculator")}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/meal-plans"
                      className="text-primary hover:underline"
                    >
                      Meal Plans
                    </Link>
                  </li>
                  <li>
                    <Link href="/burn" className="text-primary hover:underline">
                      Calories Burned Database
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <SidebarAd type="none" />
          </aside>
        </div>
      </div>
    </>
  );
}
