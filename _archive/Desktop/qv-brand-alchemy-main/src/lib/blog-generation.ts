import { supabase } from "@/integrations/supabase/client";

export const generateBlogs = async (topics: string[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-blog', {
      body: { topics },
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate blogs');
    }

    return data;
  } catch (error) {
    console.error('Blog generation error:', error);
    throw error;
  }
};

export const getRelevantTopics = () => [
  "Building Brand Systems That Scale Without Losing Soul",
  "Strategic Positioning in Hyper-Competitive Markets", 
  "The Clarity Advantage: Why Clear Brands Win in Chaos"
];