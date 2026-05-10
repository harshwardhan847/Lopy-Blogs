import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPublishedBlogs } from "@/lib/blogs";
import { BlogCard } from "@/components/blog/BlogCard";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import BannerAd from "@/components/ads/BannerAd";

interface BlogListingPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

const PAGE_SIZE = 12;

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? 1);
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}

export async function generateMetadata({
  searchParams,
}: BlogListingPageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  const pageSuffix = page > 1 ? ` – Page ${page}` : "";
  const canonical = page > 1 ? `/blog?page=${page}` : "/blog";
  const title = `Health & Fitness Blog${pageSuffix} – Tips, Guides & Nutrition Advice | Oatmeal`;
  const description =
    "Expert health and fitness articles on nutrition, calorie tracking, meal planning, weight loss, and more. Powered by Oatmeal calorie tracker.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Health & Fitness Blog${pageSuffix} | Oatmeal`,
      description:
        "Health and fitness articles on nutrition, calorie tracking, meal planning, and weight loss.",
      url: canonical,
      type: "website",
    },
  };
}

export default async function BlogListingPage({
  searchParams,
}: BlogListingPageProps) {
  const requestedPage = parsePage((await searchParams).page);
  const { blogs, page, total, totalPages } = await getAllPublishedBlogs({
    page: requestedPage,
    pageSize: PAGE_SIZE,
  });
  if (total > 0 && requestedPage > totalPages) {
    redirect(totalPages === 1 ? "/blog" : `/blog?page=${totalPages}`);
  }

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      {/* Hero */}
      <section className="py-12 px-4 text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            Health &amp; Fitness Blog
          </h1>
          <p className="text-base text-muted-foreground">
            Evidence-based articles on nutrition, calorie tracking, weight loss,
            and living a healthier life.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BannerAd type="none" />

        {blogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No articles published yet — check back soon!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Blog pagination"
                className="mt-10 flex items-center justify-between gap-4 text-sm"
              >
                {hasPreviousPage ? (
                  <Link
                    href={page - 1 === 1 ? "/blog" : `/blog?page=${page - 1}`}
                    className="font-medium text-orange-600 hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Previous</span>
                )}

                <span className="text-muted-foreground">
                  Page {page} of {totalPages} · {total} articles
                </span>

                {hasNextPage ? (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="font-medium text-orange-600 hover:underline"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Next</span>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
