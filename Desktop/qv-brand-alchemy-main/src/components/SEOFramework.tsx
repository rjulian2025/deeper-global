import { Helmet } from "react-helmet-async";
import { SEOConfig, generateMetaTags } from "@/lib/seo";

interface SEOFrameworkProps extends SEOConfig {
  children?: React.ReactNode;
}

const SEOFramework: React.FC<SEOFrameworkProps> = ({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  twitter,
  schema,
  children
}) => {
  const metaTags = generateMetaTags({
    title,
    description,
    keywords,
    canonical,
    openGraph,
    twitter,
    schema
  });

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonical || window.location.href} />
      
      {metaTags.map((tag, index) => {
        if (tag.property) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}

      {schema && schema.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}

      {children}
    </Helmet>
  );
};

export default SEOFramework;