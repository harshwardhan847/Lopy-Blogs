import { BlogCard } from "@/components/blog/BlogCard";
import type { Blog } from "@/types";

interface RelatedBlogsProps {
  blogs: Blog[];
}

export function RelatedBlogs({ blogs }: RelatedBlogsProps) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </section>
  );
}
