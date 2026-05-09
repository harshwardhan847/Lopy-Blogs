import { NextResponse } from "next/server";
import {
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
} from "@/lib/blogs";

export const dynamic = "force-dynamic";

// GET /api/admin/blogs — list all blogs (admin, includes drafts)
export async function GET() {
  try {
    const blogs = await getAllBlogsAdmin();
    return NextResponse.json(blogs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/admin/blogs — update a blog field or toggle publish status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, ...fields } = body as {
      id: number;
      action?: "publish" | "unpublish";
      [key: string]: unknown;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    let updated;
    if (action === "publish") {
      updated = await publishBlog(id);
    } else if (action === "unpublish") {
      updated = await unpublishBlog(id);
    } else {
      updated = await updateBlog(id, fields);
    }

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/blogs — delete a blog by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json(
        { error: "id query param is required" },
        { status: 400 },
      );
    }

    await deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
