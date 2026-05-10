import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getAllPublishedBlogs,
  getBlogBySlug,
  getRelatedBlogs,
} from "@/lib/blogs";
import { buildBlogMetadata } from "@/lib/seo";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import { BlogContent } from "@/components/blog/BlogContent";
import { AppCTABlock } from "@/components/blog/AppCTABlock";
import { RelatedBlogs } from "@/components/blog/RelatedBlogs";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600; // ISR: revalidate every hour
const STATIC_PARAMS_PAGE_SIZE = 1000;

interface PageProps {
  params: Promise<{ "blog-slug": string }>;
}

export async function generateStaticParams() {
  const { blogs } = await getAllPublishedBlogs({
    pageSize: STATIC_PARAMS_PAGE_SIZE,
  });
  return blogs.map((blog) => ({ "blog-slug": blog.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { "blog-slug": slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Article Not Found" };
  return buildBlogMetadata(blog);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { "blog-slug": slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(blog, 3);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogs.lopy.in";
  const articleUrl = `${SITE_URL}/blog/${blog.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    url: articleUrl,
    datePublished: blog.published_at ?? blog.created_at,
    dateModified: blog.updated_at ?? blog.created_at,
    image: blog.cover_image_url ?? undefined,
    publisher: {
      "@type": "Organization",
      name: "Oatmeal – Calorie Tracker",
      url: SITE_URL,
    },
    keywords: blog.meta_keywords?.join(", ") ?? "",
  };

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: blog.title, href: `/blog/${blog.slug}` },
        ]}
      />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Cover image */}
      {blog.cover_image_url && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-muted overflow-hidden">
          <Image
            src={blog.cover_image_url}
            alt={blog.cover_image_alt || blog.title}
            fill
            preload
            className="object-cover"
            sizes="100vw"
          />
          {blog.cover_image_credit && (
            <p className="absolute bottom-2 right-3 text-xs text-white/70 bg-black/30 px-2 py-0.5 rounded">
              {blog.cover_image_credit}
            </p>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
          {/* Main article */}
          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className="capitalize bg-orange-100 text-orange-700"
              >
                {blog.category.replace(/-/g, " ")}
              </Badge>
              <span>{blog.reading_time_minutes} min read</span>
              {blog.published_at && (
                <span>{formatDate(blog.published_at)}</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {blog.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <BlogContent content={blog.content} />

            <AppCTABlock />

            <RelatedBlogs blogs={relatedBlogs} />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block mt-0">
            <TableOfContents content={blog.content} />
          </aside>
        </div>
      </div>
    </>
  );
}
