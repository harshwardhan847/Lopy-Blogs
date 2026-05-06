import type { MealPlan } from "@/types";
import mealPlansJson from "@/data/meal-plans.json";
import { supabase } from "./supabase";

const localPlans: MealPlan[] = mealPlansJson as MealPlan[];

export async function getAllMealPlans(): Promise<MealPlan[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("meal_plans")
      .select("*")
      .order("id");
    if (!error && data && data.length > 0) return data as MealPlan[];
  }
  return localPlans;
}

export async function getMealPlanBySlug(
  slug: string,
): Promise<MealPlan | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data as MealPlan;
  }
  return localPlans.find((p) => p.slug === slug) ?? null;
}

export function getRelatedMealPlans(plan: MealPlan, limit = 3): MealPlan[] {
  const byGoal = localPlans.filter(
    (p) => p.goal === plan.goal && p.slug !== plan.slug,
  );
  if (byGoal.length >= limit) return byGoal.slice(0, limit);
  const byDiet = localPlans.filter(
    (p) =>
      p.diet_type === plan.diet_type &&
      p.slug !== plan.slug &&
      !byGoal.includes(p),
  );
  return [...byGoal, ...byDiet].slice(0, limit);
}
