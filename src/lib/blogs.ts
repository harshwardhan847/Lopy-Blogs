import { createClient } from "@supabase/supabase-js";
import type { Blog } from "@/types";

// ── Service-role client (server-only, never sent to browser) ──────────────
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Anon client (read-only for public queries) ────────────────────────────
function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return createClient(url, key);
}

// ── Public reads ──────────────────────────────────────────────────────────

export interface PublishedBlogsPage {
  blogs: Blog[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PublishedBlogsOptions {
  page?: number;
  pageSize?: number;
}

export async function getAllPublishedBlogs({
  page = 1,
  pageSize = 12,
}: PublishedBlogsOptions = {}): Promise<PublishedBlogsPage> {
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(1000, Math.max(1, Math.floor(pageSize)));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const client = getAnonClient();
  const { data, error, count } = await client
    .from("blogs")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  const total = count ?? 0;

  return {
    blogs: (data ?? []) as Blog[],
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const client = getAnonClient();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // row not found
    throw error;
  }
  return data as Blog;
}

export async function getRelatedBlogs(blog: Blog, limit = 3): Promise<Blog[]> {
  const client = getAnonClient();

  // Try same category first, exclude current blog
  const { data, error } = await client
    .from("blogs")
    .select(
      "id, slug, title, excerpt, cover_image_url, cover_image_alt, category, tags, reading_time_minutes, published_at",
    )
    .eq("status", "published")
    .eq("category", blog.category)
    .neq("id", blog.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  let results = (data ?? []) as Blog[];

  // Fill remaining slots with other published blogs if needed
  if (results.length < limit) {
    const needed = limit - results.length;
    const excludeIds = [blog.id, ...results.map((b) => b.id)];
    const { data: extra } = await client
      .from("blogs")
      .select(
        "id, slug, title, excerpt, cover_image_url, cover_image_alt, category, tags, reading_time_minutes, published_at",
      )
      .eq("status", "published")
      .not("id", "in", `(${excludeIds.join(",")})`)
      .order("published_at", { ascending: false })
      .limit(needed);

    results = [...results, ...((extra ?? []) as Blog[])];
  }

  return results;
}

// ── Admin reads (all statuses) ────────────────────────────────────────────

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const client = getServiceClient();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Blog[];
}

// ── Admin writes ──────────────────────────────────────────────────────────

export async function upsertBlog(
  blog: Omit<Blog, "id" | "created_at" | "updated_at">,
): Promise<Blog> {
  const client = getServiceClient();
  const { data, error } = await client
    .from("blogs")
    .upsert(blog, { onConflict: "slug" })
    .select()
    .single();

  if (error) throw error;
  return data as Blog;
}

export async function updateBlog(
  id: number,
  fields: Partial<Omit<Blog, "id" | "created_at" | "updated_at">>,
): Promise<Blog> {
  const client = getServiceClient();
  const { data, error } = await client
    .from("blogs")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Blog;
}

export async function publishBlog(id: number): Promise<Blog> {
  return updateBlog(id, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

export async function unpublishBlog(id: number): Promise<Blog> {
  return updateBlog(id, { status: "draft", published_at: null });
}

export async function deleteBlog(id: number): Promise<void> {
  const client = getServiceClient();
  const { error } = await client.from("blogs").delete().eq("id", id);
  if (error) throw error;
}
