-- ============================================================
-- Oatmeal Calorie Tracker — Supabase Schema
-- Run this in the Supabase SQL Editor to create the tables.
-- ============================================================

-- ---- Foods ----
CREATE TABLE IF NOT EXISTS public.foods (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  serving_size  INTEGER NOT NULL DEFAULT 100, -- grams
  calories      NUMERIC(8,2) NOT NULL,
  protein       NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs         NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat           NUMERIC(8,2) NOT NULL DEFAULT 0,
  fibre         NUMERIC(8,2) NOT NULL DEFAULT 0,
  sugar         NUMERIC(8,2) NOT NULL DEFAULT 0,
  sodium        NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on foods"
  ON public.foods FOR SELECT
  USING (true);

-- ---- Activities ----
CREATE TABLE IF NOT EXISTS public.activities (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  met_value     NUMERIC(5,2) NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on activities"
  ON public.activities FOR SELECT
  USING (true);

-- ---- Meal Plans ----
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  goal            TEXT NOT NULL,
  duration_days   INTEGER NOT NULL DEFAULT 7,
  daily_calories  INTEGER NOT NULL,
  protein_g       NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g         NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g           NUMERIC(8,2) NOT NULL DEFAULT 0,
  description     TEXT,
  why_it_works    TEXT,
  shopping_list   TEXT[] NOT NULL DEFAULT '{}',
  related_slugs   TEXT[] NOT NULL DEFAULT '{}',
  meals_json      JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on meal_plans"
  ON public.meal_plans FOR SELECT
  USING (true);

-- ---- Indexes for common queries ----
CREATE INDEX IF NOT EXISTS foods_category_idx ON public.foods (category);
CREATE INDEX IF NOT EXISTS activities_category_idx ON public.activities (category);
CREATE INDEX IF NOT EXISTS meal_plans_goal_idx ON public.meal_plans (goal);
