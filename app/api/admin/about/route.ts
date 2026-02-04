import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoos";
import { About } from "@/models/About";

export async function GET() {
  await dbConnect();

  let about = await About.findOne().lean();
  if (!about) {
    // default create (first time)
    about = await About.create({
      title: "Curating the Quiet Moments",
      subtitle:
        "Editorial is a digital sanctuary for those who appreciate thoughtful design, slow living, and the art of storytelling.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
      lead: "We started Editorial in 2024 with a simple mission: to create a space on the internet that feels like a deep breath.",
      paragraphs: [
        "In a world of infinite scrolling and bite-sized content, we wanted to bring back the feeling of sitting down with a beautiful magazine on a Sunday morning.",
        "Our team consists of writers, designers, and photographers who believe that quality matters more than quantity.",
      ],
      editorName: "Eleanor P.",
      editorRole: "Founder & Editor-in-Chief",
      editorBio:
        "Eleanor is a writer and designer based in Kyoto. She has spent the last decade exploring the intersection of minimalism, traditional craftsmanship, and modern technology.",
      editorImageUrl: "/assets/author-portrait.jpg",
      editorTwitterUrl: "",
    }).then((x: any) => x.toObject());
  }

  return NextResponse.json({ about });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  await dbConnect();

  const about = await About.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  }).lean();

  return NextResponse.json({ ok: true, about });
}
