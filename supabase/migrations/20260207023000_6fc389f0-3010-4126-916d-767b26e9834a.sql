
-- Fix: restrict INSERT to only service role (anon can't insert)
DROP POLICY "Service role can insert monitored news" ON public.monitored_news;
CREATE POLICY "Only service role can insert monitored news"
  ON public.monitored_news FOR INSERT
  WITH CHECK (false);
