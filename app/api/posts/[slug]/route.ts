import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";
import { Types } from "mongoose";

type Ctx = { params: Promise<{ slug: string }> }; // ✅ Promise রাখো

export async function GET(_: Request, ctx: Ctx) {
  await dbConnect();

  const { slug } = await ctx.params;

  const query: any = { status: "PUBLISHED" };

  // যদি ObjectId-like হয়, তাহলে _id দিয়ে খুঁজবে, নাহলে slug দিয়ে
  if (Types.ObjectId.isValid(slug) && slug.length === 24) {
    query._id = slug;
  } else {
    query.slug = slug;
  }

  const bySlug = await Post.findOne({ slug }).select("slug status").lean();
  const byId =
    Types.ObjectId.isValid(slug) && slug.length === 24
      ? await Post.findById(slug).select("slug status").lean()
      : null;

  const post = await Post.findOne(query)
    .select("title slug content excerpt category tags coverUrl createdAt")
    .lean();

  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
