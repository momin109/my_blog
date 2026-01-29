import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { Contact } from "@/models/Contact";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const { firstName, lastName, email, subject, message } = body || {};

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 },
    );
  }

  const doc = await Contact.create({
    firstName,
    lastName,
    email,
    subject,
    message,
    ip: req.headers.get("x-forwarded-for") || "",
    userAgent: req.headers.get("user-agent") || "",
  });

  return NextResponse.json({ ok: true, id: doc._id });
}

// ⚠️ Admin panel এ দেখানোর জন্য list
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Contact.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(),
  ]);

  return NextResponse.json({ items, total, page, limit });
}
