"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
// submitContactForm → supabase.functions.invoke('contact-form') → Resend (server-side)
import { submitContactForm, INQUIRY_TYPE_LABELS, type ContactFormData, type InquiryType } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MIN_PROJECT_CHARS = 50;

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact QV BRANDS",
  description:
    "Start the conversation with QV BRANDS. Book a strategic consultation to discuss your brand vision.",
  url: "https://www.qvbrands.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "QV BRANDS",
    url: "https://www.qvbrands.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@qvbrands.com",
      availableLanguage: "English",
    },
  },
};

export default function ContactPage() {
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const projectValue = watch("project", "");
  const charCount = projectValue?.length || 0;
  const charsRemaining = MIN_PROJECT_CHARS - charCount;

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await submitContactForm(data);
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll be in touch within 24 hours.",
      });
      reset();
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navigation />
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-light text-brand-hero mb-6 tracking-tight">
              Start the Conversation
            </h1>
            <p className="text-xl text-brand-text-light max-w-2xl mx-auto font-light leading-relaxed">
              Ready to build clarity into your brand? Let's discuss your vision
              and create something that endures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-light text-brand-hero mb-6">
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    {...register("website")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your name"
                    className="bg-background border-border"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    placeholder="your@email.com"
                    className="bg-background border-border"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Your company"
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">What can we help you with?</Label>
                  <Controller
                    name="inquiryType"
                    control={control}
                    rules={{ required: "Please select an inquiry type" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(INQUIRY_TYPE_LABELS) as InquiryType[]).map(
                            (key) => (
                              <SelectItem key={key} value={key}>
                                {INQUIRY_TYPE_LABELS[key]}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.inquiryType && (
                    <p className="text-sm text-destructive">
                      {errors.inquiryType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Tell Us About Your Project</Label>
                  <Textarea
                    id="project"
                    rows={6}
                    {...register("project", {
                      required: "Project description is required",
                      minLength: {
                        value: MIN_PROJECT_CHARS,
                        message: `Please provide at least ${MIN_PROJECT_CHARS} characters`,
                      },
                    })}
                    placeholder="What are you building? What challenges are you facing with your brand? The more detail you provide, the better we can understand your needs."
                    className="bg-background border-border resize-none"
                  />
                  <div className="flex justify-between items-center">
                    {errors.project ? (
                      <p className="text-sm text-destructive">
                        {errors.project.message}
                      </p>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {charsRemaining > 0
                          ? `${charsRemaining} more characters needed`
                          : `${charCount} characters`}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || isSubmitting}
                  className="w-full bg-brand-primary text-white hover:bg-brand-accent transition-colors py-6 text-lg font-medium disabled:opacity-50"
                >
                  {isLoading || isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-light text-brand-hero mb-4">
                  What to Expect
                </h3>
                <div className="space-y-4 text-brand-text-light">
                  <p>
                    We'll respond within 24 hours to schedule a strategic
                    conversation.
                  </p>
                  <p>
                    Our initial consultation is complimentary and focused on
                    understanding your unique challenges.
                  </p>
                  <p>
                    If we're a good fit, we'll propose a bespoke approach
                    tailored to your vision and timeline.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-light text-brand-hero mb-4">
                  Our Approach
                </h3>
                <div className="space-y-3 text-brand-text-light">
                  <div className="border-l-2 border-brand-accent pl-4">
                    <p className="font-medium text-brand-hero">
                      Clarity over Cleverness
                    </p>
                    <p className="text-sm">
                      Strategic thinking that cuts through the noise.
                    </p>
                  </div>
                  <div className="border-l-2 border-brand-accent pl-4">
                    <p className="font-medium text-brand-hero">
                      Built to Endure
                    </p>
                    <p className="text-sm">
                      Brand systems designed for long-term cultural resonance.
                    </p>
                  </div>
                  <div className="border-l-2 border-brand-accent pl-4">
                    <p className="font-medium text-brand-hero">
                      Human + AI Intelligence
                    </p>
                    <p className="text-sm">
                      Next-gen tools guided by timeless strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
