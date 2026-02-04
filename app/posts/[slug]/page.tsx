// import { CommentsSection } from "@/components/CommentsSection";
import { CommentsUI } from "@/components/CommentsSection";
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

  // server component এ relative /api কাজ নাও করতে পারে, তাই baseUrl safe
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
  });

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
              {/* <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 5 min read
              </span> */}
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
                {/* <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Share2 className="w-5 h-5" />
                </Button> */}
                {/* <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Bookmark className="w-5 h-5" />
                </Button> */}
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
              {/* ✅ Comment UI (শুধু ডিজাইন) */}
              <CommentsUI slug={post.slug} />
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
