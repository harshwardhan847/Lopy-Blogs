import { NextResponse } from "next/server";
import { runBlogPipeline } from "@/lib/blog-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes — blog generation is slow

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Number(body.count ?? 5), 20); // cap at 20

    const result = await runBlogPipeline(count);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
