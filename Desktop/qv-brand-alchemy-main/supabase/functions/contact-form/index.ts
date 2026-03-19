/**
 * Contact form handler: validates input, stores row, sends mail via Resend.
 * Client (Astro/React): `src/lib/supabase.ts` → `functions.invoke('contact-form')`.
 * Secrets: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Spam keyword patterns - common sales pitch phrases
const SPAM_KEYWORDS = [
  // SEO/Marketing spam
  "seo services", "link building", "backlink", "google ranking", "first page", 
  "traffic boost", "guaranteed results", "digital marketing services",
  // Dev outsourcing spam
  "offshore", "outsource", "dedicated developer", "hire developer", 
  "mobile app development", "web development services", "software development company",
  // Generic sales pitch patterns
  "we noticed your website", "i came across your", "i was browsing your site",
  "our team specializes", "we offer", "we provide", "we are a leading",
  "get in touch with us", "feel free to reach out", "looking forward to hearing",
  "let me know if you", "would love to discuss", "schedule a call",
  // Crypto/Finance spam
  "cryptocurrency", "bitcoin", "forex", "trading signals", "investment opportunity"
];

const VALID_INQUIRY_TYPES = [
  "brand-strategy", 
  "naming-architecture", 
  "identity-design", 
  "clarity-session", 
  "general-inquiry"
];

interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  inquiryType: string;
  project: string;
  website?: string; // Honeypot field
}

// Check if content contains spam keywords
const containsSpamKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Check rate limit (5 requests per 15 minutes per IP)
    const { data: recentRequests, error: rateLimitError } = await supabase
      .from('contact_submissions')
      .select('id')
      .eq('ip_address', clientIP)
      .gte('created_at', fifteenMinutesAgo.toISOString());

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (recentRequests && recentRequests.length >= 5) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, company, inquiryType, project, website }: ContactFormRequest = await req.json();

    // SPAM CHECK 1: Honeypot field - bots auto-fill hidden fields
    if (website && website.trim() !== "") {
      console.log('Honeypot triggered - likely bot submission');
      // Return success to not reveal honeypot to bots
      return new Response(
        JSON.stringify({ success: true, message: "Thank you for your message." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Basic validation
    if (!name || !email || !project || !inquiryType) {
      return new Response(
        JSON.stringify({ error: "Name, email, inquiry type, and project description are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate inquiry type
    if (!VALID_INQUIRY_TYPES.includes(inquiryType)) {
      return new Response(
        JSON.stringify({ error: "Please select a valid inquiry type." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // SPAM CHECK 2: Minimum character length
    if (project.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide more detail about your project (minimum 50 characters)." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // SPAM CHECK 3: Keyword filter
    const combinedText = `${name} ${company || ''} ${project}`;
    if (containsSpamKeywords(combinedText)) {
      console.log('Spam keywords detected in submission');
      return new Response(
        JSON.stringify({ error: "Your message was flagged as potential spam. If this is a mistake, please rephrase and try again." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Map inquiry type to label for emails
    const inquiryTypeLabels: Record<string, string> = {
      "brand-strategy": "Brand Strategy",
      "naming-architecture": "Naming & Architecture",
      "identity-design": "Identity Design",
      "clarity-session": "Clarity Session",
      "general-inquiry": "General Inquiry",
    };
    const inquiryLabel = inquiryTypeLabels[inquiryType] || inquiryType;

    // Store submission in database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        company,
        project: `[${inquiryLabel}] ${project}`,
        ip_address: clientIP,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: "Failed to process your message. Please try again." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Send notification email to business
    const businessEmailResponse = await resend.emails.send({
      from: "QV Brands <contact@resend.dev>",
      to: ["contact@qvbrands.com"], // Replace with actual business email
      subject: `[${inquiryLabel}] New inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Inquiry Type:</strong> ${inquiryLabel}</p>
        <p><strong>Project Details:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${project.replace(/\n/g, '<br>')}
        </div>
        <p><em>Submission ID: ${submission.id}</em></p>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "QV Brands <contact@resend.dev>",
      to: [email],
      subject: "Thank you for contacting QV Brands",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-weight: 300;">Thank you for reaching out, ${name}!</h1>
          
          <p>We've received your message and appreciate you taking the time to connect with us.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">What happens next?</h3>
            <ul style="color: #666;">
              <li>We'll review your project details within 24 hours</li>
              <li>If there's a good fit, we'll schedule a strategic conversation</li>
              <li>Our initial consultation is complimentary and focused on understanding your unique challenges</li>
            </ul>
          </div>
          
          <p style="color: #666;">In the meantime, feel free to explore our philosophy and approach on our website.</p>
          
          <p style="color: #666;">
            Best regards,<br>
            The QV Brands Team
          </p>
        </div>
      `,
    });

    // Update submission status
    await supabase
      .from('contact_submissions')
      .update({ 
        status: 'processed',
        business_email_sent: !!businessEmailResponse.data,
        user_email_sent: !!userEmailResponse.data
      })
      .eq('id', submission.id);

    console.log("Contact form processed successfully:", {
      submissionId: submission.id,
      businessEmail: businessEmailResponse.data?.id,
      userEmail: userEmailResponse.data?.id
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for your message. We'll be in touch within 24 hours." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);