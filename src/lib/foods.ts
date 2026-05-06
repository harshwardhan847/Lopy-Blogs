import type { Food } from "@/types";
import foodsJson from "@/data/foods.json";
import { supabase } from "./supabase";

const localFoods: Food[] = foodsJson as Food[];

export async function getAllFoods(): Promise<Food[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) return data as Food[];
  }
  return localFoods;
}

export async function getFoodBySlug(slug: string): Promise<Food | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data as Food;
  }
  return localFoods.find((f) => f.slug === slug) ?? null;
}

export function getSimilarFoods(food: Food, limit = 6): Food[] {
  return localFoods
    .filter((f) => f.category === food.category && f.slug !== food.slug)
    .slice(0, limit);
}

export function getFoodsByCategory(category: string): Food[] {
  return localFoods.filter((f) => f.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(localFoods.map((f) => f.category))].sort();
}
