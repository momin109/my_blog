import { NextResponse } from "next/server";

import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import { dbConnect } from "@/lib/mongoos";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") || "50", 10), 1),
    200,
  );
  const skip = (page - 1) * limit;

  await dbConnect();

  // সব comments (pending + approved) newest first
  const comments = await Comment.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Post info show করার জন্য slug/title join (optional but useful)
  const postIds = [...new Set(comments.map((c: any) => String(c.postId)))];
  const posts = await Post.find({ _id: { $in: postIds } })
    .select("_id slug title")
    .lean();

  const map = new Map(posts.map((p: any) => [String(p._id), p]));

  const items = comments.map((c: any) => {
    const p = map.get(String(c.postId));
    return {
      ...c,
      postSlug: p?.slug,
      postTitle: p?.title,
    };
  });

  return NextResponse.json({ items, page, limit });
}
