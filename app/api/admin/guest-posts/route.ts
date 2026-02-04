import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") || "50", 10), 1),
    200,
  );
  const skip = (page - 1) * limit;

  await dbConnect();

  // ✅ Only guest submissions (Draft first)
  const items = await Post.find({ isGuest: true })
    .sort({ status: 1, createdAt: -1 }) // DRAFT আগে, তারপর newest
    .skip(skip)
    .limit(limit)
    .select("title slug status createdAt guest")
    .lean();

  return NextResponse.json({ items, page, limit });
}
