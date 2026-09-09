-- ===================================================
-- Supabase Database Schema & Storage Setup for Portfolio
-- (Idempotent: Safe to run multiple times)
-- ===================================================

-- 1. Create site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read access on site_content" ON public.site_content;
DROP POLICY IF EXISTS "Allow write access on site_content" ON public.site_content;

-- Create policies for site_content
CREATE POLICY "Allow public read access on site_content" 
  ON public.site_content FOR SELECT 
  USING (true);

CREATE POLICY "Allow write access on site_content" 
  ON public.site_content FOR ALL 
  USING (true) 
  WITH CHECK (true);


-- 2. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public read on leads" ON public.leads;

-- Create policies for leads
CREATE POLICY "Allow public insert on leads" 
  ON public.leads FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read on leads" 
  ON public.leads FOR SELECT 
  USING (true);


-- 3. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read on bookings" ON public.bookings;

-- Create policies for bookings
CREATE POLICY "Allow public insert on bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read on bookings" 
  ON public.bookings FOR SELECT 
  USING (true);


-- 4. Create Storage Bucket for Media / Image Uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Allow public select on media storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert on media storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on media storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on media storage" ON storage.objects;

-- Create Storage Policies for 'media' bucket
CREATE POLICY "Allow public select on media storage" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'media');

CREATE POLICY "Allow public insert on media storage" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public update on media storage" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'media');

CREATE POLICY "Allow public delete on media storage" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'media');
