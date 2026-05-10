import type { Metadata } from "next";
import Link from "next/link";
import { getAllFoods, getAllCategories } from "@/lib/foods";
import BannerAd from "@/components/ads/BannerAd";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Calorie Database – Nutrition Facts for 1,000+ Foods",
  description:
    "Browse calories, protein, carbs, and fat for 1,000+ Indian and global foods. Free nutrition database by Oatmeal calorie tracker.",
  alternates: { canonical: "/calories" },
  openGraph: {
    title: "Calorie Database | Oatmeal",
    description:
      "Browse calories, protein, carbs, and fat for Indian and global foods.",
    url: "/calories",
    siteName: "Oatmeal – Calorie Tracker",
    type: "website",
  },
};

export default async function CaloriesHubPage() {
  const [foods, categories] = await Promise.all([
    getAllFoods(),
    getAllCategories(),
  ]);

  const byCategory: Record<string, typeof foods> = {};
  for (const food of foods) {
    if (!byCategory[food.category]) byCategory[food.category] = [];
    byCategory[food.category].push(food);
  }

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Calorie Database", href: "/calories" },
        ]}
      />

      {/* Hero */}
      <section className="py-12 px-4 text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground tracking-tight">
            Calorie Database
          </h1>
          <p className="text-base text-muted-foreground">
            Nutrition facts — calories, protein, carbs, fat — for {foods.length}
            + foods. Click any food for a detailed breakdown.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Ad slot */}
        <BannerAd type="none" />

        {/* Category sections */}
        <div className="space-y-14 mt-8">
          {categories.map((cat) => {
            const catFoods = byCategory[cat] ?? [];
            return (
              <section key={cat} id={cat}>
                <h2 className="text-xl font-bold mb-5 capitalize text-foreground tracking-tight">
                  {cat.replace(/-/g, " ")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catFoods.map((food) => (
                    <Link key={food.slug} href={`/calories/${food.slug}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <p className="font-semibold text-sm truncate text-foreground">
                            {food.name}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {food.calories_per_100g} kcal / 100g
                          </p>
                          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                            <span>P {food.protein}g</span>
                            <span>C {food.carbs}g</span>
                            <span>F {food.fat}g</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
