import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function searchWeb(query: string, apiKey: string): Promise<string> {
  try {
    console.log('Searching web for:', query);
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });

    if (!response.ok) {
      console.error('Firecrawl search error:', response.status);
      return 'No web search results available.';
    }

    const data = await response.json();
    const results = data.data || [];
    
    if (results.length === 0) return 'No web search results found.';

    return results.map((r: any, i: number) => {
      const snippet = r.markdown ? r.markdown.substring(0, 500) : r.description || 'No content';
      return `[Source ${i + 1}] ${r.title || 'Untitled'} (${r.url})\n${snippet}`;
    }).join('\n\n');
  } catch (err) {
    console.error('Web search failed:', err);
    return 'Web search unavailable.';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'News text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing news text:', text.substring(0, 100) + '...');

    // Step 1: Search the web for real-time verification
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    let webContext = 'No live web search was performed.';
    if (firecrawlKey) {
      webContext = await searchWeb(text.substring(0, 200), firecrawlKey);
    }

    // Step 2: AI analysis with web context
    const systemPrompt = `You are an expert fact-checker and news credibility analyst. You have access to REAL-TIME web search results to verify claims.

IMPORTANT: Use the web search results below to ground your analysis in real, current information. Cross-reference the claim against these sources.

=== LIVE WEB SEARCH RESULTS ===
${webContext}
=== END WEB SEARCH RESULTS ===

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "truthScore": <number 0-100>,
  "naiveBayes": <number 0-100>,
  "logisticRegression": <number 0-100>,
  "confidence": "<high|medium|low>",
  "factors": [
    {"text": "<factor description>", "type": "<positive|negative|neutral>", "score": <number 0-100>}
  ],
  "sources": [
    {"name": "<source name>", "url": "<url>", "credibility": <number 0-100>, "date": "<date>", "author": "<author or null>", "verdict": "<supports|contradicts|neutral>"}
  ]
}

Guidelines:
- truthScore: Overall credibility (0=completely false, 100=verified true)
- naiveBayes: Simulated ML model score based on language patterns
- logisticRegression: Simulated ML model score based on structural analysis  
- confidence: high (>80% certain), medium (50-80%), low (<50%)
- factors: Key indicators found in web results and text analysis
- sources: Use REAL sources from the web search results above when available. Include their actual URLs.
- Be realistic and varied in scoring based on actual evidence found.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this news text for credibility:\n\n${text}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to analyze news' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response:', content);

    let analysis;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7);
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3);
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3);
      analysis = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze news';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
