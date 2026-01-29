"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const fallbackImg = "/assets/hero-architecture.jpg";
const authorImg = "/assets/author-portrait.jpg";

type ApiPost = {
  _id: string;
  title: string;
  excerpt?: string;
  coverUrl?: string | null;
  category?: string;
  createdAt?: string;
  slug: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function PostsArchive() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (q.trim()) params.set("q", q.trim());
      if (category !== "All") params.set("category", category);

      const res = await fetch(`/api/posts?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        setPosts([]);
        setPagination(null);
        return;
      }

      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } finally {
      setLoading(false);
    }
  }

  // page/category change হলে reload
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  console.log("post page", posts);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            The Collection
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-foreground">
            Archive
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Browse our complete library of stories, thoughts, and curated
            collections.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 pb-8 border-b border-border">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 h-10 bg-background"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  load();
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </Button>

            {["All", "Design", "Culture", "Lifestyle", "Travel"].map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm font-normal whitespace-nowrap"
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map((p) => (
              <PostCard
                key={p._id}
                slug={p._id}
                title={p.title}
                excerpt={p.excerpt || ""}
                image={p.coverUrl || fallbackImg}
                category={p.category || "General"}
                author={{ name: "Editor", avatar: authorImg }}
                date={fmtDate(p.createdAt)}
                readTime={"5 min read"}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-20 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination?.hasPrev || loading}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          <span className="flex items-center px-4 text-muted-foreground">
            Page {pagination?.page || page} / {pagination?.totalPages || 1}
          </span>

          <Button
            variant="outline"
            disabled={!pagination?.hasNext || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
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
// import { Input } from "@/components/ui/input";
// import { Search, SlidersHorizontal } from "lucide-react";

// const heroImg = "/assets/hero-architecture.jpg";
// const authorImg = "/assets/author-portrait.jpg";
// const textureImg = "/assets/texture-paper.jpg";
// const coffeeImg = "/assets/lifestyle-coffee.jpg";

// // Extended Mock Data for Archive
// const ALL_POSTS = [
//   {
//     id: "1",
//     title: "The Art of Slow Living in a Fast-Paced Digital World",
//     excerpt: "Discovering how to disconnect to reconnect.",
//     image: heroImg,
//     category: "Lifestyle",
//     author: { name: "Eleanor P.", avatar: authorImg },
//     date: "Oct 24, 2025",
//     readTime: "8 min read",
//   },
//   {
//     id: "2",
//     title: "Minimalist Architecture: Form Follows Function",
//     excerpt: "Exploring the brutalist revival.",
//     image: coffeeImg,
//     category: "Design",
//     author: { name: "Marcus Chen", avatar: authorImg },
//     date: "Oct 22, 2025",
//     readTime: "5 min read",
//   },
//   {
//     id: "3",
//     title: "A Guide to Sustainable Coffee Culture",
//     excerpt: "From bean to cup: understanding the journey.",
//     image: coffeeImg,
//     category: "Food & Drink",
//     author: { name: "Sarah Miller", avatar: authorImg },
//     date: "Oct 20, 2025",
//     readTime: "6 min read",
//   },
//   {
//     id: "4",
//     title: "Typography Trends to Watch in 2026",
//     excerpt: "Why serifs are making a massive comeback.",
//     image: textureImg,
//     category: "Design",
//     author: { name: "Alex Rivera", avatar: authorImg },
//     date: "Oct 18, 2025",
//     readTime: "4 min read",
//   },
//   {
//     id: "5",
//     title: "Digital Nomad Diaries: Kyoto Edition",
//     excerpt: "Finding peace and productivity in Japan.",
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
//       "In an increasingly digital world, why are independent print publications flourishing?",
//     image: textureImg,
//     category: "Culture",
//     author: { name: "David Kim", avatar: authorImg },
//     date: "Oct 12, 2025",
//     readTime: "7 min read",
//   },
//   // Adding a few more for the archive feel
//   {
//     id: "7",
//     title: "Workspace Setup for Creatives",
//     excerpt: "How to organize your desk for maximum flow state.",
//     image: textureImg,
//     category: "Productivity",
//     author: { name: "Eleanor P.", avatar: authorImg },
//     date: "Sep 28, 2025",
//     readTime: "6 min read",
//   },
//   {
//     id: "8",
//     title: "Review: The Best Analog Cameras",
//     excerpt: "Why film photography is still relevant today.",
//     image: coffeeImg,
//     category: "Tech",
//     author: { name: "Marcus Chen", avatar: authorImg },
//     date: "Sep 15, 2025",
//     readTime: "9 min read",
//   },
// ];

// export default function posts() {
//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-16 md:py-24">
//         {/* Header */}
//         <div className="max-w-4xl mx-auto text-center mb-16">
//           <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
//             The Collection
//           </span>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-foreground">
//             Archive
//           </h1>
//           <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
//             Browse our complete library of stories, thoughts, and curated
//             collections.
//           </p>
//         </div>

//         {/* Filters & Search */}
//         <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 pb-8 border-b border-border">
//           <div className="relative w-full md:w-96">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search articles..."
//               className="pl-10 h-10 bg-background"
//             />
//           </div>

//           <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
//             <Button
//               variant="outline"
//               size="sm"
//               className="gap-2 whitespace-nowrap"
//             >
//               <SlidersHorizontal className="w-4 h-4" /> Filter
//             </Button>
//             {["All", "Design", "Culture", "Lifestyle", "Travel"].map(
//               (cat, i) => (
//                 <Badge
//                   key={cat}
//                   variant={i === 0 ? "default" : "outline"}
//                   className="cursor-pointer px-4 py-2 text-sm font-normal whitespace-nowrap"
//                 >
//                   {cat}
//                 </Badge>
//               ),
//             )}
//           </div>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {ALL_POSTS.map((post) => (
//             <PostCard key={post.id} {...post} />
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="mt-20 flex justify-center gap-2">
//           <Button variant="outline" disabled>
//             Previous
//           </Button>
//           <Button variant="default" className="w-10 h-10 p-0">
//             1
//           </Button>
//           <Button variant="outline" className="w-10 h-10 p-0">
//             2
//           </Button>
//           <Button variant="outline" className="w-10 h-10 p-0">
//             3
//           </Button>
//           <span className="flex items-center px-2 text-muted-foreground">
//             ...
//           </span>
//           <Button variant="outline">Next</Button>
//         </div>
//       </div>
//     </Layout>
//   );
// }
