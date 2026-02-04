import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dbConnect } from "@/lib/mongoos";
import { About } from "@/models/About";

export default async function AboutPage() {
  await dbConnect();

  const about = await About.findOne().lean();

  // fallback (যদি DB empty থাকে)
  const data = about || {
    headingTop: "Our Story",
    title: "Curating the Quiet Moments",
    subtitle:
      "Editorial is a digital sanctuary for those who appreciate thoughtful design, slow living, and the art of storytelling.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
    lead: "We started Editorial in 2024 with a simple mission: to create a space on the internet that feels like a deep breath.",
    paragraphs: [
      "In a world of infinite scrolling and bite-sized content, we wanted to bring back the feeling of sitting down with a beautiful magazine on a Sunday morning. The smell of coffee, the tactile feeling of paper (or in our case, pixels that feel like paper), and stories that stay with you long after you've finished reading.",
      "Our team consists of writers, designers, and photographers who believe that quality matters more than quantity. We don't chase trends; we explore ideas. We don't optimize for clicks; we optimize for connection.",
    ],
    editorName: "Eleanor P.",
    editorRole: "Founder & Editor-in-Chief",
    editorBio:
      "Eleanor is a writer and designer based in Kyoto. She has spent the last decade exploring the intersection of minimalism, traditional craftsmanship, and modern technology.",
    editorImageUrl: "/assets/author-portrait.jpg",
    editorTwitterUrl: "",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            {data.headingTop || "Our Story"}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-foreground">
            {data.title}
          </h1>

          {data.subtitle ? (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          ) : null}
        </div>

        {/* Hero image */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
            <img
              src={data.heroImageUrl || ""}
              alt="Our Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto prose prose-lg prose-slate md:prose-p:font-sans md:prose-p:leading-8">
          {data.lead ? (
            <p className="lead font-serif text-2xl">{data.lead}</p>
          ) : null}

          {(data.paragraphs || []).map((p: string, idx: number) => (
            <p key={idx}>{p}</p>
          ))}

          <Separator className="my-12" />

          <h3 className="font-serif text-3xl mb-8 mt-12">Meet the Editor</h3>

          <div className="not-prose flex flex-col md:flex-row gap-8 items-center md:items-start bg-secondary/20 p-8 rounded-2xl">
            <img
              src={data.editorImageUrl || "/assets/author-portrait.jpg"}
              alt={data.editorName || "Editor"}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-background"
            />

            <div className="text-center md:text-left">
              <h4 className="font-serif font-bold text-2xl mb-2">
                {data.editorName || "Editor"}
              </h4>

              {data.editorRole ? (
                <p className="text-muted-foreground mb-4">{data.editorRole}</p>
              ) : null}

              {data.editorBio ? (
                <p className="text-foreground/80 leading-relaxed mb-6">
                  {data.editorBio}
                </p>
              ) : null}

              {data.editorTwitterUrl ? (
                <a
                  href={data.editorTwitterUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline">Follow on facebook</Button>
                </a>
              ) : (
                <Button variant="outline" disabled>
                  Follow on facebook
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
