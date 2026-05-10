import { NextResponse } from "next/server";
import {
  MAX_BLOG_GENERATION_COUNT,
  runBlogPipeline,
} from "@/lib/blog-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Large AI batches can take a long time.

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const requestedCount = Number(body.count ?? 5);
    const count = Number.isFinite(requestedCount)
      ? Math.min(
          Math.max(1, Math.floor(requestedCount)),
          MAX_BLOG_GENERATION_COUNT,
        )
      : 5;

    const result = await runBlogPipeline(count);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
