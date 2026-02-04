import { NextResponse } from "next/server";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { dbConnect } from "@/lib/mongoos";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();

  const post = await Post.findOne({ slug }).select("_id");
  if (!post) return NextResponse.json({ comments: [] });

  const comments = await Comment.find({ postId: post._id, status: "APPROVED" })
    .sort({ createdAt: -1 })
    .select("name message createdAt");

  return NextResponse.json({ comments });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, message required." },
      { status: 400 },
    );
  }

  await dbConnect();

  const post = await Post.findOne({ slug }).select("_id");
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  await Comment.create({
    postId: post._id,
    name,
    email,
    message,
    status: "PENDING", // ✅ admin approve লাগবে
  });

  return NextResponse.json({ ok: true });
}
