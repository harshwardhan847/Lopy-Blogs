import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Blog } from "@/types";

interface BlogCardProps {
  blog: Blog;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      <Link href={`/blog/${blog.slug}`} className="block">
        {blog.cover_image_url ? (
          <div className="relative h-48 w-full bg-muted">
            <Image
              src={blog.cover_image_url}
              alt={blog.cover_image_alt || blog.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-orange-50 flex items-center justify-center">
            <span className="text-orange-300 text-5xl">🥦</span>
          </div>
        )}
      </Link>

      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="capitalize text-xs bg-orange-100 text-orange-700"
          >
            {blog.category.replace(/-/g, " ")}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {blog.reading_time_minutes} min read
          </span>
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="font-semibold text-lg leading-snug hover:text-orange-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {formatDate(blog.published_at)}
          </span>
          <Link
            href={`/blog/${blog.slug}`}
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
