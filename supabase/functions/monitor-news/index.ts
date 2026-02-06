import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TRENDING_TOPICS = [
  'breaking news today fact check',
  'viral news claims debunked',
  'misinformation trending social media',
  'latest fake news reports',
  'fact check political claims today',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlKey || !lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Required API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Pick a random trending topic to search
    const topic = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
    console.log('Monitoring topic:', topic);

    // Search for trending news
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: topic,
        limit: 3,
        tbs: 'qdr:d', // Last 24 hours
      }),
    });

    if (!searchResponse.ok) {
      const errText = await searchResponse.text();
      console.error('Firecrawl error:', errText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to search trending news' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();
    const results = searchData.data || [];
    const inserted: any[] = [];

    for (const result of results) {
      const headline = result.title || '';
      if (!headline || headline.length < 10) continue;

      // Check if already monitored
      const { data: existing } = await supabase
        .from('monitored_news')
        .select('id')
        .eq('headline', headline)
        .maybeSingle();

      if (existing) continue;

      // Quick AI credibility check
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-lite',
          messages: [
            { role: 'system', content: 'Rate this headline credibility 0-100. Respond with ONLY a JSON: {"score": <number>, "category": "<politics|health|science|technology|entertainment|general>", "summary": "<one sentence assessment>"}' },
            { role: 'user', content: headline }
          ],
          temperature: 0.2,
        }),
      });

      let score = 50;
      let category = 'general';
      let summary = '';

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || '';
        try {
          let clean = content.trim();
          if (clean.startsWith('```json')) clean = clean.slice(7);
          if (clean.startsWith('```')) clean = clean.slice(3);
          if (clean.endsWith('```')) clean = clean.slice(0, -3);
          const parsed = JSON.parse(clean.trim());
          score = parsed.score ?? 50;
          category = parsed.category ?? 'general';
          summary = parsed.summary ?? '';
        } catch { /* use defaults */ }
      }

      const { error: insertError } = await supabase.from('monitored_news').insert({
        headline,
        source_url: result.url || '',
        source_name: new URL(result.url || 'https://unknown.com').hostname.replace('www.', ''),
        truth_score: score,
        category,
        summary,
        status: score >= 70 ? 'verified' : score >= 40 ? 'suspicious' : 'flagged',
      });

      if (!insertError) {
        inserted.push({ headline, score });
      } else {
        console.error('Insert error:', insertError);
      }
    }

    console.log(`Monitoring complete. Inserted ${inserted.length} new items.`);

    return new Response(
      JSON.stringify({ success: true, monitored: inserted.length, items: inserted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Monitor error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Monitoring failed';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
