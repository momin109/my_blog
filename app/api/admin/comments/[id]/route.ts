import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Comment } from "@/models/Comment";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const status = String(body?.status || "").toUpperCase();
  if (!["APPROVED", "PENDING"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await dbConnect();

  const updated = await Comment.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();

  if (!updated) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await dbConnect();

  const deleted = await Comment.findByIdAndDelete(id).lean();
  if (!deleted) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
