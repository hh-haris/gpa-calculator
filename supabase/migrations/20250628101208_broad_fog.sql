/*
  # Fix migration by checking table existence first

  1. Tables
    - Only create tables if they don't exist
    - Add proper error handling for existing tables
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public access
*/

-- Create analytics table only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_analytics') THEN
    CREATE TABLE public.user_analytics (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      session_id UUID NOT NULL DEFAULT gen_random_uuid(),
      device_type TEXT,
      user_agent TEXT,
      is_returning_user BOOLEAN DEFAULT false,
      calculation_count INTEGER DEFAULT 0,
      gpa_calculated DECIMAL(3,2),
      subjects_count INTEGER,
      ip_address INET,
      event_type TEXT,
      event_data JSONB,
      page_visited TEXT,
      visit_timestamp TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Add indexes for better performance (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_analytics_session_id') THEN
    CREATE INDEX idx_user_analytics_session_id ON public.user_analytics(session_id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Allow all operations on user_analytics" ON public.user_analytics;
CREATE POLICY "Allow all operations on user_analytics" ON public.user_analytics FOR ALL USING (true) WITH CHECK (true);