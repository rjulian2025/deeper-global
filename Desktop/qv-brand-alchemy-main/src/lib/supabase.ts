/**
 * Contact form → Supabase Edge Function → Resend
 * ---------------------------------------------
 * This module does NOT call Resend from the browser. Submissions use
 * `supabase.functions.invoke('contact-form', …)`, which hits
 * `supabase/functions/contact-form/index.ts`. That Deno function sends email
 * via Resend (`RESEND_API_KEY` must be set in Supabase project secrets).
 *
 * Do not replace `invoke('contact-form')` with a direct Resend fetch from
 * the client (would expose API keys).
 */
import { supabase } from "@/integrations/supabase/client";

export type InquiryType = 
  | "brand-strategy" 
  | "naming-architecture" 
  | "identity-design" 
  | "clarity-session" 
  | "general-inquiry";

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  inquiryType: InquiryType;
  project: string;
  // Honeypot field - should always be empty
  website?: string;
}

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  "brand-strategy": "Brand Strategy",
  "naming-architecture": "Naming & Architecture",
  "identity-design": "Identity Design",
  "clarity-session": "Clarity Session",
  "general-inquiry": "General Inquiry",
};

export const submitContactForm = async (data: ContactFormData) => {
  // Client-side honeypot check (bots auto-fill hidden fields)
  if (data.website && data.website.trim() !== "") {
    // Silently reject - don't reveal honeypot to bots
    return { success: true, message: "Thank you for your message." };
  }

  // Client-side minimum length validation
  if (data.project.trim().length < 50) {
    throw new Error("Please provide more detail about your project (minimum 50 characters).");
  }

  try {
    const { data: response, error } = await supabase.functions.invoke('contact-form', {
      body: {
        name: data.name,
        email: data.email,
        company: data.company,
        inquiryType: data.inquiryType,
        project: data.project,
        website: data.website, // Pass for server-side verification
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to submit contact form');
    }

    return response;
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
};