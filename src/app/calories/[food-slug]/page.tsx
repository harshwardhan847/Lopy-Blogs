import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllFoods, getFoodBySlug, getSimilarFoods } from "@/lib/foods";
import { buildFoodMetadata } from "@/lib/seo";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import FAQSchema from "@/components/shared/FAQSchema";
import ServingCalculator from "@/components/food/ServingCalculator";
import NutritionTable from "@/components/food/NutritionTable";
import SimilarFoods from "@/components/food/SimilarFoods";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ "food-slug": string }>;
}

export async function generateStaticParams() {
  const foods = await getAllFoods();
  return foods.map((food) => ({ "food-slug": food.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { "food-slug": slug } = await params;
  const food = await getFoodBySlug(slug);
  if (!food) return { title: "Food Not Found" };
  return buildFoodMetadata(food);
}

export default async function FoodDetailPage({ params }: PageProps) {
  const { "food-slug": slug } = await params;
  const food = await getFoodBySlug(slug);
  if (!food) notFound();

  const similarFoods = getSimilarFoods(food, 6);

  const faqs = [
    {
      question: `How many calories are in ${food.name}?`,
      answer: `${food.name} contains ${food.calories_per_100g} calories per 100g. A typical serving of ${food.serving_size_label} (${food.serving_size_g}g) provides approximately ${Math.round((food.calories_per_100g * food.serving_size_g) / 100)} calories.`,
    },
    {
      question: `How much protein is in ${food.name}?`,
      answer: `${food.name} contains ${food.protein}g of protein per 100g serving.`,
    },
    {
      question: `Is ${food.name} good for weight loss?`,
      answer: `${food.name} has ${food.calories_per_100g} kcal per 100g. Whether it fits your diet depends on your total daily calorie goals. Use the Oatmeal app to track your meals and stay within your calorie budget.`,
    },
    {
      question: `How many carbs are in ${food.name}?`,
      answer: `${food.name} has ${food.carbs}g of carbohydrates per 100g, including ${food.fibre}g of dietary fibre.`,
    },
  ];

  const servingCalories = Math.round(
    (food.calories_per_100g * food.serving_size_g) / 100,
  );

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Calorie Database", href: "/calories" },
          { name: food.name, href: `/calories/${food.slug}` },
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
            <Link href="/calories" className="hover:text-primary">
              Calorie Database
            </Link>
            <span>/</span>
            <span>{food.name}</span>
          </nav>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="mb-2">
                {food.category.replace(/-/g, " ")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                {food.name}
              </h1>
              <p className="text-base text-muted-foreground">
                {food.calories_per_100g} kcal per 100g &middot;{" "}
                {servingCalories} kcal per {food.serving_size_label}
              </p>
            </div>
            <div className="shrink-0 px-6 py-4 rounded-2xl text-center bg-primary text-primary-foreground min-w-[120px]">
              <p className="text-4xl font-bold">{food.calories_per_100g}</p>
              <p className="text-sm mt-1 opacity-90">kcal / 100g</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-8">
            <ServingCalculator food={food} />
            <NutritionTable food={food} servingGrams={food.serving_size_g} />

            {/* Quick macro summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4 text-foreground">
                  Macronutrient Breakdown
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    {
                      label: "Protein",
                      value: `${food.protein}g`,
                      classes: "bg-orange-50 text-orange-600",
                    },
                    {
                      label: "Carbs",
                      value: `${food.carbs}g`,
                      classes: "bg-blue-50 text-blue-600",
                    },
                    {
                      label: "Fat",
                      value: `${food.fat}g`,
                      classes: "bg-purple-50 text-purple-600",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className={`rounded-xl p-4 ${m.classes.split(" ")[0]}`}
                    >
                      <p
                        className={`text-2xl font-bold ${m.classes.split(" ")[1]}`}
                      >
                        {m.value}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="text-xs text-muted-foreground">per 100g</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <InContentAd type="custom" />

            {/* FAQ section */}
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

            <SimilarFoods foods={similarFoods} />
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <SidebarAd type="custom" />

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Track {food.name} in Oatmeal
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Log {food.name} and thousands of other foods instantly. Free
                  calorie tracker for iOS.
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
                      href="/calculators/bmr-calculator"
                      className="text-primary hover:underline"
                    >
                      BMR Calculator
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
                      href="/calculators/bmi-calculator"
                      className="text-primary hover:underline"
                    >
                      BMI Calculator
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
