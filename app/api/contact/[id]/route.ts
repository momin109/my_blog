import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Contact } from "@/models/Contact";
import { Types } from "mongoose";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: Ctx) {
  await dbConnect();

  const { id } = await ctx.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const deleted = await Contact.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
