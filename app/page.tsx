import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const authorImg = "/assets/author-portrait.jpg";

type ApiPost = {
  _id: string;
  title: string;
  excerpt?: string;
  category?: string;
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

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/posts?home=1&limit=6`, {
    cache: "no-store",
  });
  const { featured, latest }: { featured: ApiPost | null; latest: ApiPost[] } =
    await res.json();

  const featuredPost = featured
    ? {
        slug: featured.slug,
        title: featured.title,
        excerpt: featured.excerpt || "",
        image: featured.coverUrl || "/assets/hero-architecture.jpg",
        category: featured.category || "General",
        author: { name: "Editor", avatar: authorImg },
        date: fmtDate(featured.createdAt),
        readTime: "5 min read",
      }
    : null;

  const latestPosts = (latest || []).slice(0, 5).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    image: p.coverUrl || "/assets/hero-architecture.jpg",
    category: p.category || "General",
    author: { name: "Editor", avatar: authorImg },
    date: fmtDate(p.createdAt),
    readTime: "5 min read",
  }));

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 mb-8 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-widest uppercase">
            Editor&apos;s Pick
          </span>
        </div>

        {featuredPost ? (
          <PostCard {...featuredPost} variant="featured" />
        ) : (
          <div className="text-muted-foreground">No featured post yet.</div>
        )}
      </section>

      <div className="container mx-auto px-4 py-12 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-serif font-bold">Latest Stories</h2>
              <Link href="/archive">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary cursor-pointer"
                >
                  View Archive <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-secondary/30 p-8 rounded-2xl">
              <h3 className="font-serif font-bold text-xl mb-4">
                About the Editor
              </h3>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={authorImg}
                  alt="Editor"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hi, I'm Eleanor. I write about design, culture, and slow
                    living. Welcome to my digital garden.
                  </p>
                </div>
              </div>
              <Link href="/about">
                <Button variant="link" className="p-0 h-auto text-primary">
                  Read full bio &rarr;
                </Button>
              </Link>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl mb-6">
                Explore Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Design", "Travel", "Culture", "Food", "Wellness"].map(
                  (tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full px-4 py-2 text-sm font-normal hover:bg-secondary cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

// "use client";

// import { Layout } from "@/components/Layout";
// import { PostCard } from "@/components/ui/post-card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { ArrowRight, Sparkles } from "lucide-react";
// const heroImg = "/assets/hero-architecture.jpg";
// const authorImg = "/assets/author-portrait.jpg";
// const textureImg = "/assets/texture-paper.jpg";
// const coffeeImg = "/assets/lifestyle-coffee.jpg";

// // Mock Data
// const FEATURED_POST = {
//   id: "1",
//   title: "The Art of Slow Living in a Fast-Paced Digital World",
//   excerpt:
//     "Discovering how to disconnect to reconnect. Why modern minimalism is more than just an aesthetic—it's a necessary philosophy for mental clarity in the 21st century.",
//   image: heroImg,
//   category: "Lifestyle",
//   author: {
//     name: "Eleanor P.",
//     avatar: authorImg,
//   },
//   date: "Oct 24, 2025",
//   readTime: "8 min read",
// };

// const LATEST_POSTS = [
//   {
//     id: "2",
//     title: "Minimalist Architecture: Form Follows Function",
//     excerpt:
//       "Exploring the brutalist revival and how concrete became the new marble in modern residential design.",
//     image: coffeeImg, // using coffee as placeholder if others not available
//     category: "Design",
//     author: { name: "Marcus Chen", avatar: authorImg },
//     date: "Oct 22, 2025",
//     readTime: "5 min read",
//   },
//   {
//     id: "3",
//     title: "A Guide to Sustainable Coffee Culture",
//     excerpt:
//       "From bean to cup: understanding the journey of your morning brew and why ethical sourcing matters more than ever.",
//     image: coffeeImg,
//     category: "Food & Drink",
//     author: { name: "Sarah Miller", avatar: authorImg },
//     date: "Oct 20, 2025",
//     readTime: "6 min read",
//   },
//   {
//     id: "4",
//     title: "Typography Trends to Watch in 2026",
//     excerpt:
//       "Why serifs are making a massive comeback and how variable fonts are changing the web design landscape forever.",
//     image: textureImg, // Texture background for typography post
//     category: "Design",
//     author: { name: "Alex Rivera", avatar: authorImg },
//     date: "Oct 18, 2025",
//     readTime: "4 min read",
//   },
//   {
//     id: "5",
//     title: "Digital Nomad Diaries: Kyoto Edition",
//     excerpt:
//       "Finding peace and productivity in Japan's ancient capital. A week-long journey through temples and tea houses.",
//     image: heroImg,
//     category: "Travel",
//     author: { name: "Eleanor P.", avatar: authorImg },
//     date: "Oct 15, 2025",
//     readTime: "10 min read",
//   },
//   {
//     id: "6",
//     title: "The Future of Print Magazines",
//     excerpt:
//       "In an increasingly digital world, why are independent print publications flourishing? We interview 5 editors.",
//     image: textureImg,
//     category: "Culture",
//     author: { name: "David Kim", avatar: authorImg },
//     date: "Oct 12, 2025",
//     readTime: "7 min read",
//   },
// ];

// export default function Home() {
//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-12 md:py-16">
//         <div className="flex items-center gap-2 mb-8 text-primary">
//           <Sparkles className="w-4 h-4" />
//           <span className="text-sm font-semibold tracking-widest uppercase">
//             Editor's Pick
//           </span>
//         </div>
//         <PostCard {...FEATURED_POST} variant="featured" />
//       </section>

//       <div className="container mx-auto px-4 py-12 border-t border-border">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//           {/* Main Feed */}
//           <div className="lg:col-span-8">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="text-3xl font-serif font-bold">Latest Stories</h2>
//               <Link href="/archive">
//                 <Button
//                   variant="ghost"
//                   className="text-muted-foreground hover:text-primary cursor-pointer"
//                 >
//                   View Archive <ArrowRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </Link>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
//               {LATEST_POSTS.map((post) => (
//                 <PostCard key={post.id} {...post} />
//               ))}
//             </div>

//             <div className="mt-16 flex justify-center">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="rounded-full px-8 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
//               >
//                 Load More Stories
//               </Button>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <aside className="lg:col-span-4 space-y-12">
//             {/* About Widget */}
//             <div className="bg-secondary/30 p-8 rounded-2xl">
//               <h3 className="font-serif font-bold text-xl mb-4">
//                 About the Editor
//               </h3>
//               <div className="flex items-start gap-4 mb-4">
//                 <img
//                   src={authorImg}
//                   alt="Editor"
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     Hi, I'm Eleanor. I write about design, culture, and slow
//                     living. Welcome to my digital garden.
//                   </p>
//                 </div>
//               </div>
//               <Link href="/about">
//                 <Button variant="link" className="p-0 h-auto text-primary">
//                   Read full bio &rarr;
//                 </Button>
//               </Link>
//             </div>

//             {/* Categories */}
//             <div>
//               <h3 className="font-serif font-bold text-xl mb-6">
//                 Explore Topics
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   "Design",
//                   "Interiors",
//                   "Travel",
//                   "Culture",
//                   "Technology",
//                   "Food",
//                   "Wellness",
//                 ].map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant="outline"
//                     className="rounded-full px-4 py-2 text-sm font-normal hover:bg-secondary cursor-pointer transition-colors"
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             {/* Trending / Popular */}
//             <div>
//               <h3 className="font-serif font-bold text-xl mb-6">
//                 Trending Now
//               </h3>
//               <div className="flex flex-col gap-6">
//                 {LATEST_POSTS.slice(0, 3).map((post) => (
//                   <PostCard key={post.id} {...post} variant="compact" />
//                 ))}
//               </div>
//             </div>

//             {/* Newsletter */}
//             <div className="bg-primary text-primary-foreground p-8 rounded-2xl text-center">
//               <h3 className="font-serif font-bold text-2xl mb-2">
//                 The Sunday Digest
//               </h3>
//               <p className="text-primary-foreground/80 text-sm mb-6">
//                 Join 15,000+ readers receiving our weekly curation of the best
//                 in design and culture.
//               </p>
//               <div className="space-y-3">
//                 <input
//                   type="email"
//                   placeholder="Your email address"
//                   className="w-full px-4 py-3 rounded-lg bg-primary-foreground text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 />
//                 <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
//                   Subscribe Free
//                 </Button>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </Layout>
//   );
// }
