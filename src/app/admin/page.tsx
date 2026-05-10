"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Blog } from "@/types";

interface PipelineResult {
  generated: number;
  errors: { topic: string; error: string }[];
  blogs: { slug: string; title: string; status: string }[];
}

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoadingBlogs(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  async function handleGenerate() {
    setGenerating(true);
    setResult(null);
    setGenError(null);
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setResult(data as PipelineResult);
      await fetchBlogs();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggleStatus(blog: Blog) {
    const action = blog.status === "published" ? "unpublish" : "publish";
    await fetch("/api/admin/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: blog.id, action }),
    });
    await fetchBlogs();
  }

  async function handleDelete(blog: Blog) {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/blogs?id=${blog.id}`, { method: "DELETE" });
    await fetchBlogs();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Blog Admin</h1>
        <p className="text-sm text-muted-foreground">
          Generate AI blogs and manage published articles.
        </p>
      </div>

      {/* Generator panel */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <h2 className="font-semibold text-lg">Generate Blogs</h2>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="count-input">
                Number of blogs
              </label>
              <Input
                id="count-input"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-28"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {generating ? "Generating…" : "Generate Now"}
            </Button>
          </div>

          {generating && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Fetching news, generating content with AI, uploading to database…
              This may take several minutes.
            </p>
          )}

          {genError && <p className="text-sm text-red-600">{genError}</p>}

          {result && (
            <div className="rounded-lg border p-4 space-y-3 text-sm">
              <p className="font-medium">
                ✅ Generated {result.generated} blog
                {result.generated !== 1 ? "s" : ""}
                {result.errors.length > 0
                  ? `, ${result.errors.length} error(s)`
                  : ""}
              </p>
              {result.blogs?.length > 0 && (
                <ul className="space-y-1 text-muted-foreground">
                  {result.blogs?.map((b) => (
                    <li key={b.slug}>
                      {b.status === "published" ? "🟢" : "⚪"}{" "}
                      <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-orange-600"
                      >
                        {b.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {result.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-600">
                    Errors
                  </summary>
                  <ul className="mt-1 space-y-1">
                    {result.errors.map((e, i) => (
                      <li key={i} className="text-red-500">
                        {e.topic}: {e.error}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog management table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">All Blogs ({blogs?.length})</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBlogs}
            disabled={loadingBlogs}
          >
            {loadingBlogs ? "Loading…" : "Refresh"}
          </Button>
        </div>

        {loadingBlogs ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : blogs?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No blogs yet. Generate some above!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs?.length &&
                  blogs?.length > 0 &&
                  blogs?.map((blog) => (
                    <tr
                      key={blog.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-orange-600 line-clamp-2"
                        >
                          {blog.title}
                        </a>
                      </td>
                      <td className="px-4 py-3 capitalize whitespace-nowrap">
                        {blog.category.replace(/-/g, " ")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            blog.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            blog.status === "published"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {blog.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(blog)}
                          >
                            {blog.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDelete(blog)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
