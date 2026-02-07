
-- Create monitored_news table for auto-monitoring dashboard
CREATE TABLE public.monitored_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  source_url TEXT NOT NULL DEFAULT '',
  source_name TEXT NOT NULL DEFAULT '',
  truth_score INTEGER NOT NULL DEFAULT 50,
  category TEXT NOT NULL DEFAULT 'general',
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'suspicious' CHECK (status IN ('verified', 'suspicious', 'flagged')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monitored_news ENABLE ROW LEVEL SECURITY;

-- Public read access (monitoring dashboard is public)
CREATE POLICY "Anyone can read monitored news"
  ON public.monitored_news FOR SELECT
  USING (true);

-- Only service role can insert (via edge function)
CREATE POLICY "Service role can insert monitored news"
  ON public.monitored_news FOR INSERT
  WITH CHECK (true);

-- Index for fast queries
CREATE INDEX idx_monitored_news_created_at ON public.monitored_news (created_at DESC);
CREATE INDEX idx_monitored_news_status ON public.monitored_news (status);
CREATE INDEX idx_monitored_news_category ON public.monitored_news (category);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.monitored_news;
