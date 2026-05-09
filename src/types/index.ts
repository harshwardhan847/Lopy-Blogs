export interface Food {
  id: number;
  name: string;
  slug: string;
  calories_per_100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  sugar: number;
  sodium: number;
  serving_size_g: number;
  serving_size_label: string;
  category: string;
  image_url: string;
}

export interface Activity {
  id: number;
  name: string;
  slug: string;
  met_value: number;
  category: string;
  duration_label: string;
  description: string;
}

export interface Meal {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface DayMeals {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

export interface MealPlan {
  id: number;
  diet_type: string;
  goal: string;
  slug: string;
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals_json: DayMeals[];
  description: string;
  why_it_works: string;
  shopping_list: string[];
  related_slugs: string[];
}

export interface Calculator {
  slug: string;
  title: string;
  description: string;
  faqs: { question: string; answer: string }[];
}

export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  cover_image_url: string;
  cover_image_alt: string;
  cover_image_credit: string;
  tags: string[];
  category: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  status: "draft" | "published";
  source_type: "news" | "evergreen";
  source_news_url: string | null;
  source_news_title: string | null;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
