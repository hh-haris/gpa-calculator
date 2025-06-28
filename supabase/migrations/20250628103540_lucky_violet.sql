/*
  # Fix Analytics Tracking

  1. Tables
    - Add missing columns to user_analytics table
    - Create analytics_events table for detailed event tracking
  
  2. Security
    - Enable RLS on new tables
    - Add policies for public access
*/

-- Add missing columns to user_analytics if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_analytics' AND column_name = 'page_visited'
  ) THEN
    ALTER TABLE user_analytics ADD COLUMN page_visited text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_analytics' AND column_name = 'visit_timestamp'
  ) THEN
    ALTER TABLE user_analytics ADD COLUMN visit_timestamp timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_analytics' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE user_analytics ADD COLUMN event_type text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_analytics' AND column_name = 'event_data'
  ) THEN
    ALTER TABLE user_analytics ADD COLUMN event_data jsonb;
  END IF;
END $$;

-- Create analytics_events table for detailed event tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  user_agent text,
  device_type text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Add policies for analytics_events
CREATE POLICY "Allow all operations on analytics_events"
  ON analytics_events
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at DESC);