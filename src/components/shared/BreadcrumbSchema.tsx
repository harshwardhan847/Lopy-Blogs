import type { BreadcrumbList, ListItem } from "schema-dts";

interface Crumb {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  crumbs: Crumb[];
  baseUrl?: string;
}

export default function BreadcrumbSchema({
  crumbs,
  baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in"
  ).replace(/\/$/, ""),
}: BreadcrumbSchemaProps) {
  const schema: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(
      (crumb, i): ListItem => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.href}`,
      }),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...schema }),
      }}
    />
  );
}
