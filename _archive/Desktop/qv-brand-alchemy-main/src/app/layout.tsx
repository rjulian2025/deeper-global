import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import "@/app/globals.css";
import { globalSchemaGraph } from "@/lib/schema-entities";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qvbrands.com"),
  title: {
    default: "Rick Julian — Fractional Chief Branding Officer & Growth Architect | QV Brands",
    template: "%s | QV BRANDS",
  },
  description:
    "Fractional Chief Branding Officer and growth architect for founder-led companies at critical growth stages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchemaGraph) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
