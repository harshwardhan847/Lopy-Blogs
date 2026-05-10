import type { Metadata } from "next";
import Link from "next/link";
import { getAllFoods } from "@/lib/foods";
import { getAllMealPlans } from "@/lib/meal-plans";
import { getAllPublishedBlogs } from "@/lib/blogs";
import InContentAd from "@/components/ads/InContentAd";
import BannerAd from "@/components/ads/BannerAd";
import { BlogCard } from "@/components/blog/BlogCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PILLARS = [
  {
    href: "/calories",
    emoji: "🥗",
    title: "Food Database",
    description:
      "Nutrition facts for 1,000+ Indian & global foods. Calories, protein, carbs, fat per serving.",
    cta: "Browse Foods →",
  },
  {
    href: "/burn",
    emoji: "🔥",
    title: "Calorie Burn",
    description:
      "See exactly how many calories you burn with 20+ exercises based on your weight.",
    cta: "Calculate Burn →",
  },
  {
    href: "/meal-plans",
    emoji: "📋",
    title: "Meal Plans",
    description:
      "Science-backed 7-day meal plans for weight loss, muscle gain, and maintenance.",
    cta: "View Plans →",
  },
  {
    href: "/calculators",
    emoji: "🧮",
    title: "Calculators",
    description:
      "TDEE, BMR, BMI, and macro calculators to personalise your nutrition goals.",
    cta: "Use Calculators →",
  },
];

export default async function HomePage() {
  const [foods, plans, publishedBlogs] = await Promise.all([
    getAllFoods(),
    getAllMealPlans(),
    getAllPublishedBlogs({ pageSize: 3 }),
  ]);
  const featuredFoods = foods.slice(0, 8);
  const featuredPlans = plans.slice(0, 3);
  const featuredBlogs = publishedBlogs.blogs;

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight text-foreground">
            Eat Smart. Move More.
            <br />
            <span className="text-primary">Track with Oatmeal.</span>
          </h1>
          <p className="text-lg mb-8 max-w-xl mx-auto text-muted-foreground">
            Free calorie tracker with a database of 1,000+ foods, calorie-burn
            calculator, personalised meal plans, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://apps.apple.com/app/oatmeal-calorie-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg" })}
            >
              Download Free on App Store
            </a>
            <Link
              href="/calculators/tdee-calculator"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Try TDEE Calculator →
            </Link>
          </div>
          <p className="text-xs mt-4 text-muted-foreground">
            Free forever · No credit card · iOS &amp; Android
          </p>
        </div>
      </section>

      {/* Banner Ad slot */}
      <div className="max-w-5xl mx-auto px-4">
        <BannerAd type="none" />
      </div>

      {/* 4 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-foreground tracking-tight">
          Everything you need to reach your goals
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <Link key={p.href} href={p.href} className="group">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-3">
                  <span className="text-4xl">{p.emoji}</span>
                  <h3 className="font-bold text-lg text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-sm flex-1 text-muted-foreground">
                    {p.description}
                  </p>
                  <span className="text-sm font-semibold text-primary group-hover:underline">
                    {p.cta}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Popular Foods
            </h2>
            <Link
              href="/calories"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredFoods.map((food) => (
              <Link key={food.slug} href={`/calories/${food.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm mb-1 truncate text-foreground">
                      {food.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {food.calories_per_100g} kcal / 100g
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {food.category}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* In-content ad */}
      <div className="max-w-5xl mx-auto px-4">
        <InContentAd type="custom" />
      </div>

      {/* Featured Meal Plans */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Meal Plans
          </h2>
          <Link
            href="/meal-plans"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {featuredPlans.map((plan) => (
            <Link key={plan.slug} href={`/meal-plans/${plan.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-primary">
                    {plan.diet_type}
                  </p>
                  <h3 className="font-bold text-base mb-2 text-foreground">
                    {plan.daily_calories} kcal / day
                  </h3>
                  <p className="text-sm line-clamp-2 text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
                    <span>P: {plan.protein_g}g</span>
                    <span>C: {plan.carbs_g}g</span>
                    <span>F: {plan.fat_g}g</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Blog Articles */}
      {featuredBlogs.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Latest Articles
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* App Download CTA */}
      <section className="py-16 px-4 text-center bg-foreground text-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            Ready to start tracking?
          </h2>
          <p className="text-background/70 mb-8">
            Download Oatmeal free and take your nutrition to the next level.
          </p>
          <a
            href="https://apps.apple.com/app/oatmeal-calorie-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Download Free on App Store
          </a>
        </div>
      </section>
    </>
  );
}
