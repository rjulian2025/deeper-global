import { Helmet } from "react-helmet-async";
import { globalSchemaGraph } from "@/lib/schema-entities";

/**
 * GlobalSchema Component
 * 
 * Injects the site-wide JSON-LD @graph containing:
 * - WebSite entity
 * - Organization entity (QV BRANDS)
 * - Person entity (Rick Julian)
 * 
 * This should be rendered ONCE at the app root level.
 */
const GlobalSchema = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(globalSchemaGraph)}
      </script>
    </Helmet>
  );
};

export default GlobalSchema;
