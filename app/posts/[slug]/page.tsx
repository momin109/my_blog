import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, Share2, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

type PostApi = {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  coverUrl?: string | null;
  createdAt?: string;
  slug: string;
};

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("PAGE PARAM SLUG:", slug);

  // server component এ relative /api কাজ নাও করতে পারে, তাই baseUrl safe
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
  });

  // console.log("res", res);

  if (!res.ok) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Post not found.
        </div>
      </Layout>
    );
  }

  const { post }: { post: PostApi } = await res.json();

  return (
    <Layout>
      <article className="min-h-screen">
        {/* Header */}
        <div className="bg-secondary/20 border-b border-border/50">
          <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1 text-sm tracking-widest uppercase"
              >
                {post.category || "General"}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 md:gap-8 text-muted-foreground text-sm md:text-base">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {fmtDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 5 min read
              </span>
            </div>
          </div>
        </div>

        {/* Cover */}
        <div className="container mx-auto px-4 -mt-8 md:-mt-12 mb-12 md:mb-16">
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
            <img
              src={post.coverUrl || "/assets/hero-architecture.jpg"}
              alt="Cover"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Left actions */}
            <div className="lg:col-span-2 hidden lg:flex flex-col items-end pt-4">
              <div className="sticky top-32 flex flex-col gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Bookmark className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-7 prose prose-lg prose-slate max-w-none md:prose-headings:font-serif md:prose-p:font-sans md:prose-p:leading-8">
              {post.excerpt ? (
                <p className="lead text-xl md:text-2xl font-serif leading-relaxed text-foreground/80 mb-8">
                  {post.excerpt}
                </p>
              ) : null}

              {/* content plain text হলে */}
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32">
                <h4 className="font-serif font-bold text-lg mb-4 text-foreground/80">
                  Tags
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-4 py-16 mt-16 border-t border-border">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>

            <div className="flex gap-2">
              {(post.tags || []).slice(0, 3).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

// "use client";
// import { Layout } from "@/components/Layout";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Clock, Calendar, Share2, Bookmark, ArrowLeft } from "lucide-react";
// // import { Link, useRoute } from "wouter";
// import Link from "next/link";
// const heroImg = "/assets/hero-architecture.jpg";
// const authorImg = "/assets/author-portrait.jpg";

// export default function Post({ params }: { params: { id: string } }) {
//   const id = params?.id;

//   return (
//     <Layout>
//       <article className="min-h-screen">
//         {/* Post Header */}
//         <div className="bg-secondary/20 border-b border-border/50">
//           <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl text-center">
//             <div className="flex justify-center mb-6">
//               <Badge
//                 variant="secondary"
//                 className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1 text-sm tracking-widest uppercase"
//               >
//                 Lifestyle
//               </Badge>
//             </div>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-foreground">
//               The Art of Slow Living in a Fast-Paced Digital World
//             </h1>
//             <div className="flex items-center justify-center gap-6 md:gap-8 text-muted-foreground text-sm md:text-base">
//               <div className="flex items-center gap-2">
//                 <img
//                   src={authorImg}
//                   alt="Eleanor P."
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <span className="font-medium text-foreground">Eleanor P.</span>
//               </div>
//               <span className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" /> Oct 24, 2025
//               </span>
//               <span className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" /> 8 min read
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Featured Image */}
//         <div className="container mx-auto px-4 -mt-8 md:-mt-12 mb-12 md:mb-16">
//           <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
//             <img
//               src={heroImg}
//               alt="Cover"
//               className="w-full h-[400px] md:h-[600px] object-cover"
//             />
//           </div>
//         </div>

//         {/* Content Layout */}
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
//             {/* Left Sidebar - Actions */}
//             <div className="lg:col-span-2 hidden lg:flex flex-col items-end pt-4">
//               <div className="sticky top-32 flex flex-col gap-4">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="rounded-full h-12 w-12 hover:bg-secondary hover:text-primary transition-colors border-border/50"
//                 >
//                   <Share2 className="w-5 h-5" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="rounded-full h-12 w-12 hover:bg-secondary hover:text-primary transition-colors border-border/50"
//                 >
//                   <Bookmark className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="lg:col-span-7 prose prose-lg prose-slate max-w-none md:prose-headings:font-serif md:prose-p:font-sans md:prose-p:leading-8">
//               <p className="lead text-xl md:text-2xl font-serif leading-relaxed text-foreground/80 mb-8">
//                 In an era defined by instant gratification and constant
//                 connectivity, the philosophy of slow living offers a radical
//                 counter-narrative: that doing less can actually mean living
//                 more.
//               </p>

//               <h3>The Paradox of Connectivity</h3>
//               <p>
//                 We live in a world that never sleeps. Our devices buzz with
//                 notifications, our calendars are packed with obligations, and
//                 our minds are constantly racing to keep up with the relentless
//                 pace of modern life. It's a state of perpetual motion that often
//                 leaves us feeling exhausted, anxious, and disconnected from the
//                 things that truly matter.
//               </p>
//               <p>
//                 But what if we hit pause? What if we chose to step off the
//                 hamster wheel and embrace a different rhythm? This is the core
//                 question at the heart of the slow living movement.
//               </p>

//               <figure className="my-10">
//                 <img
//                   src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop"
//                   alt="Calm interior"
//                   className="rounded-xl w-full h-[400px] object-cover"
//                 />
//                 <figcaption className="text-center text-sm text-muted-foreground mt-4 italic">
//                   Creating spaces that breathe allows our minds to do the same.
//                 </figcaption>
//               </figure>

//               <h3>Defining Slow Living</h3>
//               <p>
//                 Slow living isn't about laziness or lack of ambition. It's about
//                 intentionality. It's about making conscious choices about how we
//                 spend our time, energy, and resources. It's about prioritizing
//                 quality over quantity, depth over breadth, and connection over
//                 consumption.
//               </p>

//               <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-2xl font-serif text-primary/80 bg-secondary/20 pr-4 rounded-r-lg">
//                 "Slow living is not about doing everything at a snail's pace.
//                 It's about doing everything at the right speed." — Carl Honoré
//               </blockquote>

//               <h3>Practical Steps to Slow Down</h3>
//               <p>
//                 Start small. You don't need to move to a cabin in the woods to
//                 experience the benefits of slow living. Here are a few simple
//                 ways to incorporate this philosophy into your daily life:
//               </p>
//               <ul>
//                 <li>
//                   <strong>Digital Detox:</strong> Designate tech-free zones or
//                   times in your day.
//                 </li>
//                 <li>
//                   <strong>Mindful Eating:</strong> Sit down for meals without
//                   screens. Taste your food.
//                 </li>
//                 <li>
//                   <strong>Single-tasking:</strong> Focus on one thing at a time
//                   instead of juggling multiple tasks.
//                 </li>
//                 <li>
//                   <strong>Nature Connection:</strong> Spend time outdoors every
//                   day, even if it's just a walk around the block.
//                 </li>
//               </ul>
//             </div>

//             {/* Right Sidebar - TOC */}
//             <div className="lg:col-span-3 hidden lg:block">
//               <div className="sticky top-32">
//                 <h4 className="font-serif font-bold text-lg mb-4 text-foreground/80">
//                   Table of Contents
//                 </h4>
//                 <nav className="flex flex-col gap-3 text-sm border-l border-border/50 pl-4">
//                   <a href="#" className="text-primary font-medium">
//                     The Paradox of Connectivity
//                   </a>
//                   <a
//                     href="#"
//                     className="text-muted-foreground hover:text-primary transition-colors"
//                   >
//                     Defining Slow Living
//                   </a>
//                   <a
//                     href="#"
//                     className="text-muted-foreground hover:text-primary transition-colors"
//                   >
//                     Practical Steps to Slow Down
//                   </a>
//                   <a
//                     href="#"
//                     className="text-muted-foreground hover:text-primary transition-colors"
//                   >
//                     The Conclusion
//                   </a>
//                 </nav>

//                 <Separator className="my-8" />

//                 <div className="bg-secondary/30 rounded-xl p-6">
//                   <h4 className="font-serif font-bold text-lg mb-2">
//                     Love this article?
//                   </h4>
//                   <p className="text-xs text-muted-foreground mb-4">
//                     Sign up for our newsletter to get more stories like this
//                     delivered to your inbox.
//                   </p>
//                   <Button size="sm" className="w-full">
//                     Subscribe
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Navigation */}
//         <div className="container mx-auto px-4 py-16 mt-16 border-t border-border">
//           <div className="flex justify-between items-center max-w-4xl mx-auto">
//             <Link href="/">
//               <Button
//                 variant="ghost"
//                 className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
//               >
//                 <ArrowLeft className="w-4 h-4" /> Back to Home
//               </Button>
//             </Link>
//             <div className="flex gap-2">
//               <Badge variant="outline">Lifestyle</Badge>
//               <Badge variant="outline">Mindfulness</Badge>
//               <Badge variant="outline">Slow Living</Badge>
//             </div>
//           </div>
//         </div>
//       </article>
//     </Layout>
//   );
// }
