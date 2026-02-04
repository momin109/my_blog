import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Post } from "@/models/Post";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const status = String(body?.status || "").toUpperCase();
  if (!["PUBLISHED", "DRAFT", "SCHEDULED"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await dbConnect();

  const updated = await Post.findOneAndUpdate(
    { _id: id, isGuest: true }, // ✅ only guest posts
    { status },
    { new: true },
  ).lean();

  if (!updated) {
    return NextResponse.json(
      { message: "Guest post not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await dbConnect();

  const deleted = await Post.findOneAndDelete({
    _id: id,
    isGuest: true,
  }).lean();
  if (!deleted) {
    return NextResponse.json(
      { message: "Guest post not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
