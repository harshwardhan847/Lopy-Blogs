/**
 * AI Blog Generation Pipeline
 *
 * Uses:
 * - NewsAPI.org   → fetch today's health news headlines
 * - @fal-ai/client → call openrouter/claude-sonnet-4.6 to write the blog
 * - Unsplash API  → fetch a royalty-free cover image
 * - Supabase      → upsert blog (via lib/blogs.ts)
 *
 * Required env vars:
 *   FAL_KEY, NEWS_API_KEY, UNSPLASH_ACCESS_KEY,
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { fal } from "@fal-ai/client";

import { upsertBlog } from "@/lib/blogs";
import type { Blog } from "@/types";

// ── Config ────────────────────────────────────────────────────────────────

const APP_URL = "https://oatmeal.lopy.in";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in";

// ── Evergreen topic bank ──────────────────────────────────────────────────

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
  "Guide to Clean Eating: What It Means and How to Start",
  "Healthy Indian Foods for Weight Loss",
  "How to Build a Balanced Meal: The Plate Method Explained",
  "The Science Behind Hunger Hormones (Ghrelin and Leptin)",
  "Superfoods That Are Actually Worth the Hype",
];

// ── News API ──────────────────────────────────────────────────────────────

interface NewsArticle {
  title: string;
  url: string;
  description: string | null;
}

async function fetchHealthNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("[blog-gen] NEWS_API_KEY not set, skipping news fetch.");
    return [];
  }

  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("country", "us");
  url.searchParams.set("category", "health");
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    console.warn("[blog-gen] NewsAPI error:", res.status, await res.text());
    return [];
  }

  const json = await res.json();
  return (json.articles ?? [])
    .filter((a: NewsArticle) => a.title && a.url)
    .slice(0, 20);
}

// ── Unsplash ──────────────────────────────────────────────────────────────

interface UnsplashImage {
  url: string;
  alt: string;
  credit: string;
}

async function fetchCoverImage(query: string): Promise<UnsplashImage | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("[blog-gen] UNSPLASH_ACCESS_KEY not set, skipping image.");
    return null;
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.warn("[blog-gen] Unsplash error:", res.status);
    return null;
  }

  const { results } = await res.json();
  //randomly pick one from the results
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photo = (results as any[]).sort(() => Math.random() - 0.5)[0];
  if (!photo) return null;

  return {
    url: photo.urls?.regular ?? photo.urls?.full ?? "",
    alt: photo.alt_description ?? query,
    credit: `Photo by ${photo.user?.name ?? "Unknown"} on Unsplash`,
  };
}

// ── AI Blog Writer ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a professional health and fitness content writer.
You write engaging, evidence-based articles for a general adult audience who want to lose weight, eat healthier, and live fitter lives.

WRITING STYLE:
- Conversational yet authoritative tone
- Use "you" to address the reader directly
- Short paragraphs (2–4 sentences)
- Use subheadings, bullet points, and numbered lists generously
- Include real numbers and scientific context where relevant
- Never be preachy; be practical and actionable

INTERNAL LINKS (use natural anchor text, link to these pages where relevant):
- Food database: ${SITE_URL}/calories
- Calorie burn calculator: ${SITE_URL}/burn
- TDEE calculator: ${SITE_URL}/calculators/tdee
- BMI calculator: ${SITE_URL}/calculators/bmi
- Meal plans: ${SITE_URL}/meal-plans

SEO REQUIREMENTS:
- Target keyword must appear in the title, first H2, and first 100 words of the article
- Use LSI keywords naturally throughout
- Target article length: 1200–1600 words.`;

const METADATA_PROMPT = `${SYSTEM_PROMPT}

Return ONLY valid JSON for the blog metadata. Do not include the article body, markdown fences, or extra text.

OUTPUT FORMAT:
{
  "title": "Article title (target keyword near the start)",
  "slug": "url-friendly-slug-without-numbers",
  "excerpt": "150-160 character summary for meta description",
  "meta_title": "SEO title <= 60 chars",
  "meta_description": "SEO description 150-160 chars",
  "meta_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "category": "one of: nutrition | fitness | weight-loss | meal-planning | health | recipes"
}`;

const CONTENT_PROMPT = `${SYSTEM_PROMPT}

STRUCTURE:
1. Hook introduction (1-2 paragraphs that capture attention immediately)
2. 4-6 H2 sections covering the topic in depth
3. Practical tips section
4. Oatmeal CTA paragraph (before conclusion) - see format below
5. Conclusion (3-5 sentences)

OATMEAL CTA FORMAT (always include before conclusion, personalise to the article topic):
"If you want to take control of your [relevant goal, e.g. "calorie intake", "macros", "weight"], **[Oatmeal - Calorie Tracker](${APP_URL})** makes it effortless. Track every meal, log your workouts, and see your daily macros in real time - all from your phone. **[Download Oatmeal free](${APP_URL})** and start reaching your goals today."

Return ONLY the markdown article body. Do not wrap it in JSON or markdown fences. Do not include a top-level H1 because the page already renders the title.`;

interface AIBlogMetadata {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  tags: string[];
  category: string;
}

interface AIBlogOutput extends AIBlogMetadata {
  content_md: string;
  reading_time_minutes: number;
}

async function callFalLLM(
  systemPrompt: string,
  prompt: string,
  maxTokens: number,
) {
  const stream = await fal.stream("openrouter/router", {
    input: {
      model: "google/gemini-2.5-flash",
      //   model: "anthropic/claude-sonnet-4.6",
      system_prompt: systemPrompt,
      prompt,
      temperature: 0.7,
      max_tokens: maxTokens,
    },
  });
  console.info("[AI Called]");

  //   for await (const event of stream) {
  //     console.log(event);
  //   }

  const result = await stream.done();
  return ((result as { output?: string }).output ?? "").trim();
}

function stripJsonFence(raw: string) {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function estimateReadingTimeMinutes(markdown: string) {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeMetadata(
  metadata: Partial<AIBlogMetadata>,
  fallbackTopic: string,
): AIBlogMetadata {
  const title = metadata.title?.trim() || fallbackTopic;
  const excerpt = metadata.excerpt?.trim() || title;
  const metaTitle = metadata.meta_title?.trim() || title.slice(0, 60);
  const metaDescription = metadata.meta_description?.trim() || excerpt;
  const parsedTags = Array.isArray(metadata.tags)
    ? metadata.tags.filter((tag) => typeof tag === "string")
    : [];
  const tags = parsedTags.length > 0 ? parsedTags : ["health"];
  const parsedMetaKeywords = Array.isArray(metadata.meta_keywords)
    ? metadata.meta_keywords.filter((keyword) => typeof keyword === "string")
    : [];
  const metaKeywords =
    parsedMetaKeywords.length > 0 ? parsedMetaKeywords : tags;

  return {
    title,
    slug: metadata.slug?.trim() || slugify(title),
    excerpt,
    meta_title: metaTitle,
    meta_description: metaDescription,
    meta_keywords: metaKeywords,
    tags,
    category: metadata.category?.trim() || "health",
  };
}

async function generateBlogContent(
  topic: string,
  newsArticle?: NewsArticle,
): Promise<AIBlogOutput> {
  const topicPrompt = newsArticle
    ? `Write a detailed health and fitness blog post inspired by this news:
     "${newsArticle.title}"\n\n
     News URL (cite as source if relevant): ${newsArticle.url}\n\n
     Make the article practical and actionable for readers trying to improve their diet and fitness. 
     Don't just summarise the news — use it as a hook to write a full educational piece.`
    : `Write a detailed health and fitness blog post on the following topic:\n\n"${topic}"\n\nMake it practical, evidence-based, and engaging.`;

  // Configure fal with the API key
  fal.config({ credentials: process.env.FAL_KEY });

  const metadataRaw = await callFalLLM(METADATA_PROMPT, topicPrompt, 1200);
  const jsonStr = stripJsonFence(metadataRaw);

  let metadata: AIBlogMetadata;
  try {
    metadata = normalizeMetadata(JSON.parse(jsonStr), topic);
  } catch {
    throw new Error(
      `[blog-gen] Failed to parse AI metadata JSON output. Raw: ${metadataRaw.slice(0, 500)}`,
    );
  }

  const contentRaw = await callFalLLM(
    CONTENT_PROMPT,
    `${topicPrompt}

Use this approved metadata:
Title: ${metadata.title}
Slug: ${metadata.slug}
Excerpt: ${metadata.excerpt}
Primary keyword: ${metadata.meta_keywords?.[0] ?? metadata.title}
Category: ${metadata.category}
Tags: ${metadata.tags.join(", ")}`,
    4096,
  );
  const content_md = contentRaw
    .replace(/^```markdown\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return {
    ...metadata,
    content_md,
    reading_time_minutes: estimateReadingTimeMinutes(content_md),
  };
}

// ── Main Pipeline ─────────────────────────────────────────────────────────

export interface PipelineResult {
  generated: number;
  errors: { topic: string; error: string }[];
  blogs: Pick<Blog, "slug" | "title" | "status">[];
}

export async function runBlogPipeline(count = 10): Promise<PipelineResult> {
  const result: PipelineResult = { generated: 0, errors: [], blogs: [] };

  // Fetch today's news (may be empty if key missing)
  const newsArticles = await fetchHealthNews();

  // Split: half from news, half from evergreen (or all evergreen if no news)
  const newsCount = Math.min(Math.floor(count / 2), newsArticles.length);
  const evergreenCount = count - newsCount;

  // Shuffle evergreen topics
  const shuffled = [...EVERGREEN_TOPICS].sort(() => Math.random() - 0.5);

  const tasks: Array<{ topic: string; news?: NewsArticle }> = [
    ...newsArticles.slice(0, newsCount).map((news) => ({
      topic: news.title,
      news,
    })),
    ...shuffled.slice(0, evergreenCount).map((topic) => ({ topic })),
  ];

  for (const task of tasks) {
    try {
      // Generate content via AI
      const aiOutput = await generateBlogContent(task.topic, task.news);

      // Fetch cover image
      const imageQuery = `${aiOutput?.category ?? "health"} ${aiOutput?.tags?.[0] ?? "health fitness"}`;
      let image: UnsplashImage | null = null;
      try {
        image = await fetchCoverImage(imageQuery);
      } catch (err) {
        console.warn(
          `[blog-gen] Failed to fetch image for "${task.topic}":`,
          err,
        );
      }

      // Build blog object
      const blog: Omit<Blog, "id" | "created_at" | "updated_at"> = {
        slug: aiOutput.slug,
        title: aiOutput.title,
        excerpt: aiOutput.excerpt,
        content: aiOutput.content_md,
        cover_image_url: image?.url ?? "",
        cover_image_alt: image?.alt ?? aiOutput.title,
        cover_image_credit: image?.credit ?? "",
        tags: aiOutput.tags,
        category: aiOutput.category,
        meta_title: aiOutput.meta_title,
        meta_description: aiOutput.meta_description,
        meta_keywords: aiOutput.meta_keywords,
        status: "published",
        source_type: task.news ? "news" : "evergreen",
        source_news_url: task.news?.url ?? null,
        source_news_title: task.news?.title ?? null,
        reading_time_minutes: aiOutput.reading_time_minutes ?? 7,
        published_at: new Date().toISOString(),
      };

      const saved = await upsertBlog(blog);
      result.generated++;
      result.blogs.push({
        slug: saved.slug,
        title: saved.title,
        status: saved.status,
      });
      console.log(`[blog-gen] Saved: /${saved.slug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[blog-gen] Error for "${task.topic}":`, msg);
      result.errors.push({ topic: task.topic, error: msg });
    }
  }

  return result;
}
