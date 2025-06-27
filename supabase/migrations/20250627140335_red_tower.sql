/*
  # Database Schema Setup for UoH GPA Calculator

  1. New Tables
    - `user_analytics` - Track user behavior and analytics
    - `suggestions` - Store user suggestions for platform improvements
    - `suggestion_votes` - Track votes on suggestions
    - `gpa_posts` - Store published GPA/CGPA posts
    - `gpa_reactions` - Store reactions to GPA posts

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no authentication required)

  3. Performance
    - Add indexes for frequently queried columns
*/

-- Create analytics table to track user behavior
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  device_type TEXT,
  user_agent TEXT,
  is_returning_user BOOLEAN DEFAULT false,
  calculation_count INTEGER DEFAULT 0,
  gpa_calculated DECIMAL(3,2),
  subjects_count INTEGER,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  name TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  additional_info TEXT,
  is_verified_student BOOLEAN DEFAULT true,
  votes INTEGER DEFAULT 0,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggestion votes table
CREATE TABLE IF NOT EXISTS public.suggestion_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID,
  session_id UUID NOT NULL,
  vote_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GPA posts table
CREATE TABLE IF NOT EXISTS public.gpa_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  name TEXT,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  semester TEXT NOT NULL,
  message TEXT,
  gpa DECIMAL(3,2) NOT NULL,
  type TEXT NOT NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GPA post reactions table
CREATE TABLE IF NOT EXISTS public.gpa_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID,
  session_id UUID NOT NULL,
  reaction_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'suggestion_votes_suggestion_id_fkey'
  ) THEN
    ALTER TABLE public.suggestion_votes 
    ADD CONSTRAINT suggestion_votes_suggestion_id_fkey 
    FOREIGN KEY (suggestion_id) REFERENCES public.suggestions(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gpa_reactions_post_id_fkey'
  ) THEN
    ALTER TABLE public.gpa_reactions 
    ADD CONSTRAINT gpa_reactions_post_id_fkey 
    FOREIGN KEY (post_id) REFERENCES public.gpa_posts(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'suggestion_votes_vote_type_check'
  ) THEN
    ALTER TABLE public.suggestion_votes 
    ADD CONSTRAINT suggestion_votes_vote_type_check 
    CHECK (vote_type IN ('up', 'down'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gpa_posts_type_check'
  ) THEN
    ALTER TABLE public.gpa_posts 
    ADD CONSTRAINT gpa_posts_type_check 
    CHECK (type IN ('GPA', 'CGPA'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gpa_reactions_reaction_type_check'
  ) THEN
    ALTER TABLE public.gpa_reactions 
    ADD CONSTRAINT gpa_reactions_reaction_type_check 
    CHECK (reaction_type IN ('clap', 'fire', 'laugh', 'cry'));
  END IF;
END $$;

-- Add unique constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'suggestion_votes_suggestion_id_session_id_key'
  ) THEN
    ALTER TABLE public.suggestion_votes 
    ADD CONSTRAINT suggestion_votes_suggestion_id_session_id_key 
    UNIQUE(suggestion_id, session_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gpa_reactions_post_id_session_id_key'
  ) THEN
    ALTER TABLE public.gpa_reactions 
    ADD CONSTRAINT gpa_reactions_post_id_session_id_key 
    UNIQUE(post_id, session_id);
  END IF;
END $$;

-- Add indexes for better performance if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_analytics_session_id'
  ) THEN
    CREATE INDEX idx_user_analytics_session_id ON public.user_analytics(session_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_suggestions_created_at'
  ) THEN
    CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gpa_posts_created_at'
  ) THEN
    CREATE INDEX idx_gpa_posts_created_at ON public.gpa_posts(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_suggestion_votes_suggestion_id'
  ) THEN
    CREATE INDEX idx_suggestion_votes_suggestion_id ON public.suggestion_votes(suggestion_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gpa_reactions_post_id'
  ) THEN
    CREATE INDEX idx_gpa_reactions_post_id ON public.gpa_reactions(post_id);
  END IF;
END $$;

-- Enable Row Level Security (make everything public for now since no auth)
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpa_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpa_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access) if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on user_analytics'
  ) THEN
    CREATE POLICY "Allow all operations on user_analytics" ON public.user_analytics FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on suggestions'
  ) THEN
    CREATE POLICY "Allow all operations on suggestions" ON public.suggestions FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on suggestion_votes'
  ) THEN
    CREATE POLICY "Allow all operations on suggestion_votes" ON public.suggestion_votes FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on gpa_posts'
  ) THEN
    CREATE POLICY "Allow all operations on gpa_posts" ON public.gpa_posts FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on gpa_reactions'
  ) THEN
    CREATE POLICY "Allow all operations on gpa_reactions" ON public.gpa_reactions FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;