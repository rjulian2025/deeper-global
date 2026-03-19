"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Contact from "@/views/pages/Contact";

/**
 * client:only — Supabase client uses localStorage; avoids SSR.
 * Form still uses submitContactForm → Edge Function → Resend (unchanged).
 */
export default function ContactIsland() {
  return (
    <TooltipProvider>
      <Contact />
      <Toaster />
    </TooltipProvider>
  );
}
