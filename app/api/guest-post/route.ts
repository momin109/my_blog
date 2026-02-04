import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const fullName = String(body?.fullName || "").trim();
  const email = String(body?.email || "").trim();
  const title = String(body?.title || "").trim();
  const slug = String(body?.slug || "").trim();
  const content = String(body?.content || "").trim();

  if (!fullName || !email || !title || !slug || !content) {
    return NextResponse.json(
      { message: "Full name, email, title, slug, content are required." },
      { status: 400 },
    );
  }

  await dbConnect();

  const adminAuthorId = process.env.ADMIN_AUTHOR_ID;
  if (!adminAuthorId) {
    return NextResponse.json(
      { message: "ADMIN_AUTHOR_ID is missing in env." },
      { status: 500 },
    );
  }

  const exists = await Post.findOne({ slug }).select("_id");
  if (exists) {
    return NextResponse.json(
      { message: "This slug already exists. Please change the title." },
      { status: 409 },
    );
  }

  const post = await Post.create({
    title,
    slug,
    content,
    excerpt: body?.excerpt || undefined,
    category: body?.category || undefined,
    tags: Array.isArray(body?.tags) ? body.tags : [],
    coverUrl: body?.coverUrl || null,

    status: "DRAFT",
    views: 0,
    authorId: adminAuthorId,

    // আপনার model এ এগুলো add করা আছে ধরে নিচ্ছি
    isGuest: true,
    guest: { name: fullName, email },
  });

  return NextResponse.json({ ok: true, post });
}
