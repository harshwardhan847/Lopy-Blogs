/**
 * Oatmeal – Supabase seed script
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
 *   npx tsx src/scripts/seed-supabase.ts
 *
 * Requires: @supabase/supabase-js
 */

//load environment variables from .env.local
import { createClient } from "@supabase/supabase-js";
import foods from "../data/foods.json";
import activities from "../data/activities.json";
import mealPlans from "../data/meal-plans.json";

const supabaseUrl = "https://ihlbrxcfskzkvipcyyeh.supabase.co";
const supabaseKey = "sb_publishable_GDGbvUdfid9kVziLeN6N8A_rltKkB1F";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seedFoods() {
  console.log(`Seeding ${foods.length} foods…`);
  const rows = foods.map((food) => ({
    id: food.id,
    name: food.name,
    slug: food.slug,
    calories_per_100g: food.calories_per_100g,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fibre: food.fibre,
    sugar: food.sugar,
    sodium: food.sodium,
    serving_size_g: food.serving_size_g,
    serving_size_label: food.serving_size_label,
    category: food.category,
    // image_url: food.image_url,
  }));
  const { error } = await supabase
    .from("foods")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`Foods upsert failed: ${error.message}`);
  console.log("✓ Foods seeded");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seedActivities() {
  console.log(`Seeding ${activities.length} activities…`);
  const { error } = await supabase
    .from("activities")
    .upsert(activities, { onConflict: "slug" });
  if (error) throw new Error(`Activities upsert failed: ${error.message}`);
  console.log("✓ Activities seeded");
}

async function seedMealPlans() {
  console.log(`Seeding ${mealPlans.length} meal plans…`);
  const rows = mealPlans.map((plan) => ({
    ...plan,
    title: plan.diet_type,
    meals_json: plan.meals_json ?? [],
    shopping_list: plan.shopping_list ?? [],
    related_slugs: plan.related_slugs ?? [],
  }));
  const { error } = await supabase
    .from("meal_plans")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`Meal plans upsert failed: ${error.message}`);
  console.log("✓ Meal plans seeded");
}

async function main() {
  try {
    // await seedFoods();
    // await seedActivities();
    await seedMealPlans();
    console.log("\nAll data seeded successfully.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
