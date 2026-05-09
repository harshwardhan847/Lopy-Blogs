import type { MetadataRoute } from "next";
import { getAllFoods } from "@/lib/foods";
import { getAllActivities } from "@/lib/activities";
import { getAllMealPlans } from "@/lib/meal-plans";
import { getAllPublishedBlogs } from "@/lib/blogs";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [foods, activities, mealPlans, blogs] = await Promise.all([
    getAllFoods(),
    getAllActivities(),
    getAllMealPlans(),
    getAllPublishedBlogs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/burn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/meal-plans`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators/tdee-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculators/bmr-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculators/macro-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculators/bmi-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const foodRoutes: MetadataRoute.Sitemap = foods.map((f) => ({
    url: `${BASE_URL}/calories/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const activityRoutes: MetadataRoute.Sitemap = activities.map((a) => ({
    url: `${BASE_URL}/burn/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const mealPlanRoutes: MetadataRoute.Sitemap = mealPlans.map((p) => ({
    url: `${BASE_URL}/meal-plans/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.published_at
      ? new Date(b.published_at)
      : new Date(b.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [
    ...staticRoutes,
    ...foodRoutes,
    ...activityRoutes,
    ...mealPlanRoutes,
    ...blogIndex,
    ...blogRoutes,
  ];
}
