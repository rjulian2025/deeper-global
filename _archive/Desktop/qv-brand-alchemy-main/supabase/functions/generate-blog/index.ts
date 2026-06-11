import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting blog generation...');
    
    const { topics } = await req.json();
    
    if (!topics || !Array.isArray(topics)) {
      throw new Error('Topics array is required');
    }

    const generatedBlogs = [];

    for (const topic of topics) {
      console.log(`Generating blog for topic: ${topic}`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a strategic brand consultant writing for QV Brands. Write high-quality, strategic blog content that helps brands build clarity and navigate complex challenges. Focus on practical insights, strategic thinking, and helping brands differentiate in crowded markets. Write in a sophisticated but accessible tone.`
            },
            {
              role: 'user',
              content: `Write a comprehensive blog post about "${topic}" for brand strategists and business leaders. Include:
              - A compelling title (max 60 characters)
              - A 2-sentence excerpt that captures the key insight
              - Full article content (800-1200 words) with clear headings
              - Focus on actionable insights and strategic thinking
              - Use examples and practical applications
              
              Format the response as JSON with: title, excerpt, content, tags (array of 3-5 relevant tags)`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const blogContent = JSON.parse(data.choices[0].message.content);

      // Insert into Supabase
      const { data: insertedBlog, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: blogContent.title,
          excerpt: blogContent.excerpt,
          content: blogContent.content,
          author: 'QV Strategy Team',
          author_title: 'Brand Strategists',
          tags: blogContent.tags,
          is_featured: false,
          published_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      generatedBlogs.push(insertedBlog);
      console.log(`Successfully created blog: ${blogContent.title}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        blogs: generatedBlogs,
        count: generatedBlogs.length 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-blog function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});