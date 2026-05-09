import type { Metadata } from "next";
import { getAllPublishedBlogs } from "@/lib/blogs";
import { BlogCard } from "@/components/blog/BlogCard";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import BannerAd from "@/components/ads/BannerAd";

export const metadata: Metadata = {
  title: "Health & Fitness Blog – Tips, Guides & Nutrition Advice | Oatmeal",
  description:
    "Expert health and fitness articles on nutrition, calorie tracking, meal planning, weight loss, and more. Powered by Oatmeal calorie tracker.",
  openGraph: {
    title: "Health & Fitness Blog | Oatmeal",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogListingPage() {
  const blogs = await getAllPublishedBlogs();

  // Group by category for sections
  const byCategory: Record<string, typeof blogs> = {};
  for (const blog of blogs) {
    if (!byCategory[blog.category]) byCategory[blog.category] = [];
    byCategory[blog.category].push(blog);
  }

  const categories = Object.keys(byCategory);

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
        ) : categories.length > 0 ? (
          <div className="space-y-14 mt-8">
            {categories.map((cat) => (
              <section key={cat} id={cat}>
                <h2 className="text-xl font-bold mb-5 capitalize tracking-tight">
                  {cat.replace(/-/g, " ")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byCategory[cat].map((blog) => (
                    <BlogCard key={blog.slug} blog={blog} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
