
-- Create analytics table to track user behavior
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggestions table
CREATE TABLE public.suggestions (
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
CREATE TABLE public.suggestion_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID REFERENCES public.suggestions(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(suggestion_id, session_id)
);

-- Create GPA posts table (replacing mock data)
CREATE TABLE public.gpa_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  name TEXT,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  semester TEXT NOT NULL,
  message TEXT,
  gpa DECIMAL(3,2) NOT NULL,
  type TEXT CHECK (type IN ('GPA', 'CGPA')) NOT NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GPA post reactions table
CREATE TABLE public.gpa_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.gpa_posts(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('clap', 'fire', 'laugh', 'cry')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, session_id)
);

-- Add indexes for better performance
CREATE INDEX idx_user_analytics_session_id ON public.user_analytics(session_id);
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
CREATE INDEX idx_gpa_posts_created_at ON public.gpa_posts(created_at DESC);
CREATE INDEX idx_suggestion_votes_suggestion_id ON public.suggestion_votes(suggestion_id);
CREATE INDEX idx_gpa_reactions_post_id ON public.gpa_reactions(post_id);

-- Enable Row Level Security (make everything public for now since no auth)
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpa_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpa_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access)
CREATE POLICY "Allow all operations on user_analytics" ON public.user_analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on suggestions" ON public.suggestions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on suggestion_votes" ON public.suggestion_votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on gpa_posts" ON public.gpa_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on gpa_reactions" ON public.gpa_reactions FOR ALL USING (true) WITH CHECK (true);
