import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact QV BRANDS | Start Your Brand Strategy Conversation",
  description:
    "Ready to build clarity into your brand? Contact QV BRANDS for strategic brand development, naming systems, and identity architecture. Response within 24 hours.",
  keywords:
    "contact brand strategist, brand consultation, brand strategy inquiry, QV BRANDS contact",
  alternates: { canonical: "https://www.qvbrands.com/contact" },
  openGraph: {
    title: "Contact QV BRANDS | Start Your Brand Strategy Conversation",
    description:
      "Ready to build clarity into your brand? Contact QV BRANDS for strategic brand development. Response within 24 hours.",
    url: "https://www.qvbrands.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact QV BRANDS | Start Your Brand Strategy Conversation",
    description:
      "Ready to build clarity into your brand? Contact QV BRANDS for strategic brand development.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
