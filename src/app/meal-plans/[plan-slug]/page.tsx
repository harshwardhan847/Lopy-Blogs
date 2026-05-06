import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllMealPlans,
  getMealPlanBySlug,
  getRelatedMealPlans,
} from "@/lib/meal-plans";
import { buildMealPlanMetadata } from "@/lib/seo";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import FAQSchema from "@/components/shared/FAQSchema";
import MacroSummaryCard from "@/components/meal-plan/MacroSummaryCard";
import MealScheduleTable from "@/components/meal-plan/MealScheduleTable";
import ShoppingList from "@/components/meal-plan/ShoppingList";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ "plan-slug": string }>;
}

export async function generateStaticParams() {
  const plans = await getAllMealPlans();
  return plans.map((p) => ({ "plan-slug": p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { "plan-slug": slug } = await params;
  const plan = await getMealPlanBySlug(slug);
  if (!plan) return { title: "Meal Plan Not Found" };
  return buildMealPlanMetadata(plan);
}

export default async function MealPlanDetailPage({ params }: PageProps) {
  const { "plan-slug": slug } = await params;
  const plan = await getMealPlanBySlug(slug);
  if (!plan) notFound();

  const related = getRelatedMealPlans(plan, 3);

  const faqs = [
    {
      question: `What is the ${plan.diet_type} meal plan?`,
      answer: plan.description,
    },
    {
      question: `How many calories does this meal plan have?`,
      answer: `This ${plan.diet_type} meal plan targets ${plan.daily_calories} calories per day with ${plan.protein_g}g protein, ${plan.carbs_g}g carbs, and ${plan.fat_g}g fat.`,
    },
    {
      question: `Is this ${plan.diet_type} meal plan good for ${plan.goal}?`,
      answer: plan.why_it_works,
    },
    {
      question: `Can I track this meal plan in an app?`,
      answer:
        "Yes! Download the free Oatmeal calorie tracker app to log meals, track macros, and monitor your progress toward your goal.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Meal Plans", href: "/meal-plans" },
          { name: `${plan.diet_type} Plan`, href: `/meal-plans/${plan.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />

      {/* Hero */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs mb-4 flex gap-1 flex-wrap text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/meal-plans" className="hover:text-primary">
              Meal Plans
            </Link>
            <span>/</span>
            <span>{plan.diet_type}</span>
          </nav>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="mb-2">
                {plan.goal}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                {plan.diet_type} Meal Plan for {plan.goal}
              </h1>
              <p className="text-base text-muted-foreground">
                {plan.description}
              </p>
            </div>
            <div className="shrink-0 px-6 py-4 rounded-2xl text-center bg-primary text-primary-foreground min-w-[140px]">
              <p className="text-4xl font-bold">{plan.daily_calories}</p>
              <p className="text-sm mt-1 opacity-90">kcal/day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main */}
          <div className="lg:col-span-2 space-y-8">
            <MacroSummaryCard plan={plan} />
            <MealScheduleTable meals={plan.meals_json} />

            {/* Why it works */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-3 text-foreground">
                  Why This Plan Works
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {plan.why_it_works}
                </p>
              </CardContent>
            </Card>

            <InContentAd type="custom" />

            {/* FAQ */}
            <section>
              <h2 className="font-bold text-xl mb-5 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
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

            {/* Related plans */}
            {related.length > 0 && (
              <section>
                <h2 className="font-bold text-xl mb-5 text-foreground">
                  Related Meal Plans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <Link key={rel.slug} href={`/meal-plans/${rel.slug}`}>
                      <Card className="hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-4">
                          <p className="font-semibold text-sm mb-1 text-foreground">
                            {rel.diet_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rel.goal} · {rel.daily_calories} kcal/day
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <SidebarAd type="custom" />

            <ShoppingList items={plan.shopping_list} />

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Track This Plan Free
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Log meals, hit your macro targets, and track progress with the
                  Oatmeal app.
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
                  Related Tools
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/calculators/tdee-calculator"
                      className="text-primary hover:underline"
                    >
                      TDEE Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/macro-calculator"
                      className="text-primary hover:underline"
                    >
                      Macro Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/bmr-calculator"
                      className="text-primary hover:underline"
                    >
                      BMR Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calories"
                      className="text-primary hover:underline"
                    >
                      Calorie Database
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
