import { 
  generateAnswerArticleSchema, 
  generateAnswerPageBreadcrumb 
} from "@/lib/schema-entities";

interface AnswerPageSchemaProps {
  slug: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * AnswerPageSchema Component
 * 
 * Injects Article + BreadcrumbList JSON-LD for individual /answers/* pages.
 * References the global Person and Organization entities via stable @id.
 */
const AnswerPageSchema = ({ slug, headline, description, datePublished, dateModified }: AnswerPageSchemaProps) => {
  const articleSchema = generateAnswerArticleSchema({ slug, headline, description, datePublished, dateModified });
  const breadcrumbSchema = generateAnswerPageBreadcrumb(headline, slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
};

export default AnswerPageSchema;
