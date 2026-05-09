/**
 * Supabase Edge Function: generate-daily-blogs
 *
 * Deno runtime — no Node.js / Next.js imports.
 * Called by pg_cron daily, or manually via admin UI.
 *
 * Deploy:
 *   supabase functions deploy generate-daily-blogs --no-verify-jwt
 *
 * Required secrets (set in Supabase dashboard → Edge Functions → Secrets):
 *   FAL_KEY, NEWS_API_KEY, UNSPLASH_ACCESS_KEY, SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
 *   NEXT_PUBLIC_SITE_URL
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_URL = "https://oatmeal.lopy.in";

// ── CORS headers ─────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Evergreen topics ──────────────────────────────────────────────────────

const EVERGREEN_TOPICS = [
  "10 High-Protein Breakfast Ideas to Start Your Day Right",
  "How to Count Calories for Weight Loss: A Complete Beginner's Guide",
  "TDEE vs BMR: What's the Difference and Why It Matters",
  "The Best Foods for Building Muscle on a Budget",
  "How Much Protein Do You Actually Need Per Day?",
  "Intermittent Fasting: Benefits, Types, and Who Should Try It",
  "The Complete Guide to Macro Tracking for Fat Loss",
  "10 Low-Calorie Snacks That Actually Keep You Full",
  "Why Your Metabolism Slows Down and How to Fix It",
  "The Science of Calorie Deficit: How to Lose Weight Without Starving",
  "Best Pre-Workout Foods for Energy and Performance",
  "How to Meal Prep for the Week in Under 2 Hours",
  "Understanding Food Labels: What to Look For When Shopping",
  "The Healthiest Cooking Oils: A Nutritionist's Guide",
  "Hydration and Weight Loss: How Water Affects Your Body",
  "Best Foods to Eat Before Bed Without Gaining Weight",
  "How to Eat Out and Still Hit Your Macros",
  "The Truth About Cheat Meals: Do They Help or Hurt?",
  "Cardio vs. Strength Training: Which Burns More Fat?",
  "How to Break Through a Weight Loss Plateau",
  "Plant-Based Protein Sources for Vegans and Vegetarians",
  "The Best High-Fiber Foods for a Healthier Gut",
  "How Sleep Affects Weight Loss and Muscle Gain",
  "Understanding BMI: Is It Still Useful?",
  "The Best Post-Workout Meals for Recovery",
  "How to Stay on Track with Your Diet on Weekends",
  "Benefits of Walking 10,000 Steps a Day",
  "Foods That Naturally Boost Testosterone",
  "How Stress Causes Weight Gain (and What to Do About It)",
  "The Best Low-Carb Foods That Are Actually Filling",
];

// ── Helpers ───────────────────────────────────────────────────────────────

async function fetchHealthNews() {
  const apiKey = Deno.env.get("NEWS_API_KEY");
  if (!apiKey) return [];
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=health&pageSize=10&apiKey=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.articles ?? [])
      .filter((a: { title?: string; url?: string }) => a.title && a.url)
      .slice(0, 10);
  } catch {
    return [];
  }
}

async function fetchCoverImage(query: string) {
  const accessKey = Deno.env.get("UNSPLASH_ACCESS_KEY");
  if (!accessKey) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const photo = json.results?.[0];
    if (!photo) return null;
    return {
      url: photo.urls?.regular ?? "",
      alt: photo.alt_description ?? query,
      credit: `Photo by ${photo.user?.name ?? "Unknown"} on Unsplash`,
    };
  } catch {
    return null;
  }
}

function buildSystemPrompt(siteUrl: string) {
  return `You are a professional health and fitness content writer.
You write engaging, evidence-based articles for a general adult audience who want to lose weight, eat healthier, and live fitter lives.

WRITING STYLE:
- Conversational yet authoritative tone
- Use "you" to address the reader directly
- Short paragraphs (2–4 sentences)
- Use subheadings, bullet points, and numbered lists generously
- Include real numbers and scientific context where relevant

STRUCTURE:
1. Hook introduction (1–2 paragraphs)
2. 4–6 H2 sections covering the topic in depth
3. Practical tips section
4. Oatmeal CTA paragraph (before conclusion)
5. Conclusion (3–5 sentences)

INTERNAL LINKS (use natural anchor text):
- Food database: ${siteUrl}/calories
- Calorie burn calculator: ${siteUrl}/burn
- TDEE calculator: ${siteUrl}/calculators/tdee
- BMI calculator: ${siteUrl}/calculators/bmi
- Meal plans: ${siteUrl}/meal-plans

OATMEAL CTA (always include before conclusion):
"If you want to take control of your nutrition, **[Oatmeal – Calorie Tracker](${APP_URL})** makes it effortless. Track every meal, log your workouts, and see your daily macros in real time — all from your phone. **[Download Oatmeal free](${APP_URL})** and start reaching your goals today."

SEO REQUIREMENTS:
- Target keyword in title, first H2, and first 100 words
- Target length: 1500–2500 words

OUTPUT FORMAT (return ONLY valid JSON — no markdown fences, no extra text):
{
  "title": "Article title",
  "slug": "url-friendly-slug",
  "excerpt": "150–160 character summary",
  "content_md": "Full markdown article (1500–2500 words)",
  "meta_title": "SEO title ≤ 60 chars",
  "meta_description": "SEO description 150–160 chars",
  "meta_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "category": "one of: nutrition | fitness | weight-loss | meal-planning | health | recipes",
  "reading_time_minutes": 7
}`;
}

async function generateBlogContent(
  systemPrompt: string,
  topic: string,
  newsArticle?: { title: string; url: string },
) {
  const falKey = Deno.env.get("FAL_KEY");
  if (!falKey) throw new Error("FAL_KEY not set");

  const userPrompt = newsArticle
    ? `Write a detailed health and fitness blog post inspired by this news: "${newsArticle.title}"\n\nNews URL: ${newsArticle.url}\n\nUse it as a hook to write a full educational piece.`
    : `Write a detailed health and fitness blog post on the following topic:\n\n"${topic}"\n\nMake it practical, evidence-based, and engaging.`;

  const res = await fetch("https://fal.run/fal-ai/any-llm", {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-5",
      system_prompt: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const raw = (json.output ?? "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(raw);
}

// ── Main handler ──────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Validate authorization
  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!authHeader.endsWith(serviceRoleKey)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const count = Number(body.count ?? 10);

    const supabaseUrl =
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ??
      Deno.env.get("SUPABASE_URL") ??
      "";
    const siteUrl =
      Deno.env.get("NEXT_PUBLIC_SITE_URL") ?? "https://blogs.lopy.in";
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const systemPrompt = buildSystemPrompt(siteUrl);

    const news = await fetchHealthNews();
    const newsCount = Math.min(Math.floor(count / 2), news.length);
    const evergreenCount = count - newsCount;
    const shuffled = [...EVERGREEN_TOPICS].sort(() => Math.random() - 0.5);

    const tasks = [
      ...news.slice(0, newsCount).map((n: { title: string; url: string }) => ({
        topic: n.title,
        news: n,
      })),
      ...shuffled.slice(0, evergreenCount).map((t: string) => ({ topic: t })),
    ];

    const generated: string[] = [];
    const errors: { topic: string; error: string }[] = [];

    for (const task of tasks) {
      try {
        const aiOutput = await generateBlogContent(
          systemPrompt,
          task.topic,
          task.news,
        );
        const image = await fetchCoverImage(
          `${aiOutput.category} ${aiOutput.tags?.[0] ?? "health"}`,
        );

        const blog = {
          slug: aiOutput.slug,
          title: aiOutput.title,
          excerpt: aiOutput.excerpt,
          content: aiOutput.content_md,
          cover_image_url: image?.url ?? "",
          cover_image_alt: image?.alt ?? aiOutput.title,
          cover_image_credit: image?.credit ?? "",
          tags: aiOutput.tags ?? [],
          category: aiOutput.category ?? "health",
          meta_title: aiOutput.meta_title ?? aiOutput.title,
          meta_description: aiOutput.meta_description ?? aiOutput.excerpt,
          meta_keywords: aiOutput.meta_keywords ?? [],
          status: "published",
          source_type: task.news ? "news" : "evergreen",
          source_news_url: task.news?.url ?? null,
          source_news_title: task.news?.title ?? null,
          reading_time_minutes: aiOutput.reading_time_minutes ?? 7,
          published_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("blogs")
          .upsert(blog, { onConflict: "slug" });
        if (error) throw error;

        generated.push(aiOutput.slug);
        console.log(`[edge] Generated: ${aiOutput.slug}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push({ topic: task.topic, error: msg });
        console.error(`[edge] Error: ${msg}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated: generated.length,
        slugs: generated,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
