import type { Metadata } from "next";
import { getAllMealPlans } from "@/lib/meal-plans";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Indian Meal Plans – Weight Loss, Muscle Gain & More | Oatmeal",
  description:
    "Browse 10+ expertly designed Indian meal plans for weight loss, muscle gain, keto, vegetarian, and more. Free weekly schedules with macros. Track with Oatmeal.",
  alternates: { canonical: "https://oatmealapp.com/meal-plans" },
  openGraph: {
    title: "Indian Meal Plans – Weight Loss, Muscle Gain & More | Oatmeal",
    description:
      "Free Indian meal plans with macro targets and weekly schedules. Download Oatmeal to track automatically.",
    url: "https://oatmealapp.com/meal-plans",
    siteName: "Oatmeal – Calorie Tracker",
    type: "website",
  },
};

export default async function MealPlansHubPage() {
  const plans = await getAllMealPlans();

  const byGoal: Record<string, typeof plans> = {};
  for (const plan of plans) {
    if (!byGoal[plan.goal]) byGoal[plan.goal] = [];
    byGoal[plan.goal].push(plan);
  }
  const goals = Object.keys(byGoal);

  return (
    <main>
      {/* Hero */}
      <section className="py-12 px-4 text-center bg-background">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground tracking-tight">
          Free Indian Meal Plans
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-muted-foreground">
          Expert-designed weekly meal plans with calories, macros, and shopping
          lists. From keto to vegetarian, find the right plan for your goal.
        </p>
        <a
          href="https://apps.apple.com/app/oatmeal"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          Track Meals Free →
        </a>
      </section>

      {/* Plans by goal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {goals.map((goal) => (
          <section key={goal} className="mb-14">
            <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
              {goal}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {byGoal[goal].map((plan) => (
                <a key={plan.slug} href={`/meal-plans/${plan.slug}`}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="font-semibold text-base text-foreground">
                          {plan.diet_type}
                        </p>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {plan.goal}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2 mb-4 text-muted-foreground">
                        {plan.description}
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: "kcal", val: plan.daily_calories },
                          { label: "P", val: `${plan.protein_g}g` },
                          { label: "C", val: `${plan.carbs_g}g` },
                          { label: "F", val: `${plan.fat_g}g` },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg py-2 bg-primary/10"
                          >
                            <p className="text-sm font-bold text-primary">
                              {m.val}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {m.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
