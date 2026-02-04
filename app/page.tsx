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
  // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(
    "https://my-blog-virid-two.vercel.app/api/posts?home=1&limit=6",
    { cache: "no-store" },
  );
  // const res = await fetch("/api/posts?home=1&limit=6", {
  //   cache: "no-store",
  // });
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
