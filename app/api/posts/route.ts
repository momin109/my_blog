import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";

export async function GET(req: Request) {
  await dbConnect();

  const url = new URL(req.url);

  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limitRaw = parseInt(url.searchParams.get("limit") || "9", 10);
  const limit = Math.min(Math.max(limitRaw, 1), 50); // 1..50

  const q = url.searchParams.get("q")?.trim() || "";
  const category = url.searchParams.get("category")?.trim() || "";
  const home = url.searchParams.get("home") === "1"; // home mode

  // ✅ public: only published
  const filter: any = { status: "PUBLISHED" };

  if (category && category !== "All") filter.category = category;

  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { content: new RegExp(q, "i") },
      { excerpt: new RegExp(q, "i") },
    ];
  }

  // -------- Home mode (featured + latest) --------
  if (home) {
    const latestLimit = Math.min(limit, 20);

    const latest = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(latestLimit)
      .select("title slug excerpt category coverUrl createdAt")
      .lean();

    const featured = latest[0] ?? null;

    return NextResponse.json({
      featured,
      latest,
    });
  }

  // -------- Archive mode (pagination) --------
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt category coverUrl createdAt")
      .lean(),
    Post.countDocuments(filter),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  });
}
