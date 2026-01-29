import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";
import { postCreateSchema } from "@/lib/validators/post";
import { requireAdmin } from "@/lib/adminAuth"; // ✅ JWT admin check

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  await dbConnect();

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status")?.trim() || "";

  const filter: any = {};
  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { content: new RegExp(q, "i") },
    ];
  }
  if (status) filter.status = status;

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .select("title category status createdAt updatedAt views slug")
    .lean();

  // ✅ client-friendly _id
  const normalized = posts.map((p: any) => ({ ...p, _id: p._id.toString() }));

  return NextResponse.json({ posts: normalized });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  await dbConnect();

  const body = await req.json();
  const parsed = postCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await Post.create({
    ...parsed.data,
    tags: parsed.data.tags ?? [],
    coverUrl: parsed.data.coverUrl || null,
    status: parsed.data.status ?? "DRAFT",
    authorId: admin.sub, // ✅ JWT payload থেকে admin id
  });

  return NextResponse.json(
    { post: { ...created.toObject(), _id: created._id.toString() } },
    { status: 201 },
  );
}
