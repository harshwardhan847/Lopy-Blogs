import type { Metadata } from "next";
import { getAllActivities, getAllActivityCategories } from "@/lib/activities";
import { calcMET } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Calories Burned Calculator – 20+ Activities | Oatmeal",
  description:
    "Find out how many calories you burn doing any activity. Browse 20+ exercises with calorie burn calculators by weight and duration. Track workouts free with Oatmeal.",
  alternates: { canonical: "https://oatmealapp.com/burn" },
  openGraph: {
    title: "Calories Burned Calculator – 20+ Activities | Oatmeal",
    description:
      "Free calorie burn calculator for running, cycling, yoga, HIIT, and more. Track your workouts with Oatmeal app.",
    url: "https://oatmealapp.com/burn",
    siteName: "Oatmeal – Calorie Tracker",
    type: "website",
  },
};

export default async function BurnHubPage() {
  const [activities, categories] = await Promise.all([
    getAllActivities(),
    Promise.resolve(getAllActivityCategories()),
  ]);

  const activitiesByCategory: Record<string, typeof activities> = {};
  for (const cat of categories) {
    activitiesByCategory[cat] = activities.filter((a) => a.category === cat);
  }

  return (
    <main>
      {/* Hero */}
      <section className="py-12 px-4 text-center bg-background">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground tracking-tight">
          Calories Burned Calculator
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-muted-foreground">
          Discover how many calories you burn with {activities.length}+
          exercises. Enter your weight and duration for a personalised estimate.
        </p>
        <a
          href="https://apps.apple.com/app/oatmeal"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          Track Workouts Free →
        </a>
      </section>

      {/* Activities by category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.map((cat) => (
          <section key={cat} className="mb-14">
            <h2 className="text-2xl font-bold mb-6 capitalize text-foreground tracking-tight">
              {cat.replace(/-/g, " ")} Activities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activitiesByCategory[cat].map((activity) => {
                const burn30 = calcMET(activity.met_value, 70, 30);
                const burn60 = calcMET(activity.met_value, 70, 60);
                return (
                  <a key={activity.slug} href={`/burn/${activity.slug}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate text-foreground">
                              {activity.name}
                            </p>
                            <p className="text-xs mt-0.5 text-muted-foreground">
                              MET {activity.met_value}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs shrink-0"
                          >
                            {cat}
                          </Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                          <div className="rounded-xl py-2 bg-accent/30">
                            <p className="text-lg font-bold text-primary">
                              {burn30}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              kcal / 30 min
                            </p>
                          </div>
                          <div className="rounded-xl py-2 bg-accent/30">
                            <p className="text-lg font-bold text-primary">
                              {burn60}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              kcal / 60 min
                            </p>
                          </div>
                        </div>
                        <p className="text-xs mt-3 line-clamp-2 text-muted-foreground">
                          {activity.description}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
