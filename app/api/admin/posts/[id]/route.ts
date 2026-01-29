import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireAdmin } from "@/lib/adminAuth";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";
import { postUpdateSchema } from "@/lib/validators/post";

function forbid() {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}
function badId() {
  return NextResponse.json({ message: "Invalid id" }, { status: 400 });
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  if (!requireAdmin()) return forbid();

  const { id } = await ctx.params; // ✅ FIX
  if (!mongoose.Types.ObjectId.isValid(id)) return badId();

  await dbConnect();

  const post = await Post.findById(id).lean();
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!requireAdmin()) return forbid();

  const { id } = await ctx.params; // ✅ FIX
  if (!mongoose.Types.ObjectId.isValid(id)) return badId();

  await dbConnect();

  const body = await req.json();
  const parsed = postUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const update: any = { ...parsed.data };
  if (update.coverUrl === "") update.coverUrl = null;

  const post = await Post.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function DELETE(_: Request, ctx: Ctx) {
  if (!requireAdmin()) return forbid();

  const { id } = await ctx.params; // ✅ FIX
  if (!mongoose.Types.ObjectId.isValid(id)) return badId();

  await dbConnect();

  await Post.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
