import { 
  generateProfilePageSchema, 
  authorPageBreadcrumb 
} from "@/lib/schema-entities";

/**
 * AuthorPageSchema Component
 * 
 * Injects ProfilePage + BreadcrumbList JSON-LD for the /meet-the-strategist page.
 * References the global Person entity via stable @id for AEO reconciliation.
 */
const AuthorPageSchema = () => {
  const profilePageSchema = generateProfilePageSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorPageBreadcrumb) }} />
    </>
  );
};

export default AuthorPageSchema;
