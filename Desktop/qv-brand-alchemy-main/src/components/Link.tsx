import type { AnchorHTMLAttributes } from "react";

/**
 * Framework-agnostic Link - renders <a> for Astro/static compatibility.
 * Use href for internal/external links. Supports same API as next/link.
 */
export default function Link({
  href,
  to,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) {
  const url = href || to || "#";
  const isExternal = url.startsWith("http");
  return (
    <a
      href={url}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
}
