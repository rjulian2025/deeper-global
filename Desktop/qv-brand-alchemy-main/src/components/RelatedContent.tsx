import Link from "@/components/Link";

interface RelatedLink {
  title: string;
  path: string;
}

interface RelatedContentProps {
  links: RelatedLink[];
  hubLinks?: { title: string; path: string }[];
}

/**
 * RelatedContent — reusable cross-linking component for answer/blog pages.
 * Renders "Related reading" links + hub navigation to strengthen internal link graph.
 */
const RelatedContent = ({ links, hubLinks }: RelatedContentProps) => {
  const defaultHubLinks = [
    { title: "Brand Strategy Knowledge Base", path: "/answers" },
    { title: "Strategic Growth Answers", path: "/strategic-answers" },
    { title: "Blog", path: "/blog" },
    { title: "About Rick Julian", path: "/rick-julian" },
  ];

  const hubs = hubLinks || defaultHubLinks;

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        {links.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Related Reading
            </h3>
            <nav className="space-y-2">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="block text-foreground hover:text-accent transition-colors text-base font-light"
                >
                  {link.title} →
                </Link>
              ))}
            </nav>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Explore
          </h3>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {hubs.map((hub, index) => (
              <Link
                key={index}
                href={hub.path}
                className="hover:text-foreground transition-colors"
              >
                {hub.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default RelatedContent;
