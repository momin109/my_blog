import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ message: "file is required" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "services" },
      (error, res) => (error ? reject(error) : resolve(res)),
    );
    stream.end(buffer);
  });

  return NextResponse.json({
    url: result.secure_url, // ✅ এটা DB তে save হবে
    publicId: result.public_id, // চাইলে delete/update এ কাজে লাগবে
  });
}
