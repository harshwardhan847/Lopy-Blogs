import type { Activity } from "@/types";
import activitiesJson from "@/data/activities.json";
import { supabase } from "./supabase";

const localActivities: Activity[] = activitiesJson as Activity[];

export async function getAllActivities(): Promise<Activity[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("name");
    if (!error && data && data.length > 0) return data as Activity[];
  }
  return localActivities;
}

export async function getActivityBySlug(
  slug: string,
): Promise<Activity | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data as Activity;
  }
  return localActivities.find((a) => a.slug === slug) ?? null;
}

export function getSimilarActivities(
  activity: Activity,
  limit = 6,
): Activity[] {
  return localActivities
    .filter((a) => a.category === activity.category && a.slug !== activity.slug)
    .slice(0, limit);
}

export function getAllActivityCategories(): string[] {
  return [...new Set(localActivities.map((a) => a.category))].sort();
}
