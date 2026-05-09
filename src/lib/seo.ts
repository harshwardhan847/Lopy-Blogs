import type { Metadata } from "next";
import type { Food, Activity, MealPlan, Blog } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in";
const SITE_NAME = "Oatmeal – Calorie Tracker";

export function buildFoodMetadata(food: Food): Metadata {
  const title = `${food.name} Calories & Nutrition Facts | Oatmeal`;
  const description = `${food.name} has ${food.calories_per_100g} calories per 100g. Full nutrition: protein ${food.protein}g, carbs ${food.carbs}g, fat ${food.fat}g. Track it free with Oatmeal app.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/calories/${food.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/calories/${food.slug}`,
      siteName: SITE_NAME,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export function buildActivityMetadata(activity: Activity): Metadata {
  const title = `Calories Burned ${activity.name} – Calculator | Oatmeal`;
  const description = `How many calories does ${activity.name} burn? Use our free calculator to find calories burned by weight and duration. Track workouts with Oatmeal.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/burn/${activity.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/burn/${activity.slug}`,
      siteName: SITE_NAME,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export function buildMealPlanMetadata(plan: MealPlan): Metadata {
  const title = `${plan.daily_calories} Cal ${plan.diet_type} Meal Plan for ${plan.goal.replace(/_/g, " ")} | Oatmeal`;
  const description = `${plan.description} Macros: ${plan.protein_g}g protein, ${plan.carbs_g}g carbs, ${plan.fat_g}g fat daily.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/meal-plans/${plan.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/meal-plans/${plan.slug}`,
      siteName: SITE_NAME,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export function buildCalculatorMetadata(slug: string): Metadata {
  const map: Record<string, { title: string; description: string }> = {
    tdee: {
      title: "TDEE Calculator – Total Daily Energy Expenditure | Oatmeal",
      description:
        "Calculate your Total Daily Energy Expenditure (TDEE) based on your weight, height, age, and activity level.",
    },
    bmr: {
      title: "BMR Calculator – Basal Metabolic Rate | Oatmeal",
      description:
        "Find your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Know your baseline calorie needs.",
    },
    macros: {
      title: "Macro Calculator – Protein, Carbs & Fat | Oatmeal",
      description:
        "Calculate your daily macro targets for weight loss, muscle gain, or maintenance.",
    },
    "calorie-deficit": {
      title: "Calorie Deficit Calculator – Lose Weight Safely | Oatmeal",
      description:
        "Find the right calorie deficit for safe, sustainable weight loss without losing muscle.",
    },
    "ideal-weight": {
      title: "Ideal Weight Calculator | Oatmeal",
      description:
        "Calculate your ideal body weight based on height and gender using the Devine formula.",
    },
    bmi: {
      title: "BMI Calculator – Body Mass Index | Oatmeal",
      description:
        "Calculate your Body Mass Index (BMI) and find out if you are underweight, normal, overweight, or obese.",
    },
  };
  const meta = map[slug] ?? {
    title: "Calculator | Oatmeal",
    description: "Free health calculator.",
  };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${SITE_URL}/calculators/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/calculators/${slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function buildBlogMetadata(blog: Blog): Metadata {
  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.excerpt;
  const canonicalUrl = `${SITE_URL}/blog/${blog.slug}`;
  const imageUrl = blog.cover_image_url || undefined;

  return {
    title,
    description,
    keywords: blog.meta_keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: blog.published_at ?? undefined,
      modifiedTime: blog.updated_at,
      tags: blog.tags,
      images: imageUrl
        ? [{ url: imageUrl, alt: blog.cover_image_alt || title }]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
