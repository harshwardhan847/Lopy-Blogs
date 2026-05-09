-- ============================================================
-- Oatmeal Blogs — Supabase Schema
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- Enable the pg_net extension (required for http_post in pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ---- Blogs ----
CREATE TABLE IF NOT EXISTS public.blogs (
  id                    SERIAL PRIMARY KEY,
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  excerpt               TEXT NOT NULL,
  content               TEXT NOT NULL,                 -- markdown
  cover_image_url       TEXT NOT NULL DEFAULT '',
  cover_image_alt       TEXT NOT NULL DEFAULT '',
  cover_image_credit    TEXT NOT NULL DEFAULT '',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  category              TEXT NOT NULL DEFAULT 'health',
  meta_title            TEXT NOT NULL DEFAULT '',
  meta_description      TEXT NOT NULL DEFAULT '',
  meta_keywords         TEXT[] NOT NULL DEFAULT '{}',
  status                TEXT NOT NULL DEFAULT 'draft'  -- 'draft' | 'published'
                          CHECK (status IN ('draft', 'published')),
  source_type           TEXT NOT NULL DEFAULT 'evergreen' -- 'news' | 'evergreen'
                          CHECK (source_type IN ('news', 'evergreen')),
  source_news_url       TEXT,
  source_news_title     TEXT,
  reading_time_minutes  INTEGER NOT NULL DEFAULT 5,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published blogs
CREATE POLICY "Public read published blogs"
  ON public.blogs FOR SELECT
  USING (status = 'published');

-- Service role bypasses RLS (for API routes / edge functions)
-- (Supabase service role key already bypasses RLS by default)

-- Indexes
CREATE INDEX IF NOT EXISTS blogs_slug_idx        ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS blogs_status_idx      ON public.blogs (status);
CREATE INDEX IF NOT EXISTS blogs_category_idx    ON public.blogs (category);
CREATE INDEX IF NOT EXISTS blogs_published_at_idx ON public.blogs (published_at DESC);
CREATE INDEX IF NOT EXISTS blogs_tags_idx        ON public.blogs USING GIN (tags);

-- ============================================================
-- pg_cron — Daily blog generation at 06:00 UTC
-- Run this AFTER deploying the generate-daily-blogs edge function.
-- Replace YOUR_PROJECT_REF and YOUR_SERVICE_ROLE_KEY.
-- ============================================================

/*
SELECT cron.schedule(
  'generate-daily-blogs',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://YOUR_PROJECT_REF.functions.supabase.co/generate-daily-blogs',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body    := '{"count": 10}'::jsonb
  )
  $$
);
*/

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('generate-daily-blogs');
