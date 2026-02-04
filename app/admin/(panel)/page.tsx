"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Pagination = {
  total: number;
};

type PostItem = {
  _id: string;
  title: string;
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  createdAt?: string;
};

type CommentItem = {
  _id: string;
  name: string;
  message: string;
  status: "PENDING" | "APPROVED";
  createdAt?: string;
  postTitle?: string; // API দিলে ভাল
};

function fmtDateOnly(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function shortText(s: string, n = 80) {
  const t = (s || "").trim();
  if (t.length <= n) return t;
  return t.slice(0, n) + "…";
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [recentComments, setRecentComments] = useState<CommentItem[]>([]);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [postsRes, commentsRes] = await Promise.all([
        fetch("/api/admin/posts?page=1&limit=4", { cache: "no-store" }),
        fetch("/api/admin/comments?page=1&limit=4", { cache: "no-store" }),
      ]);

      const postsJson = await postsRes.json().catch(() => ({}));
      const commentsJson = await commentsRes.json().catch(() => ({}));

      // ✅ আপনার API যদি items নামে দেয়, এখানে পরিবর্তন করুন
      const posts: PostItem[] = postsJson.posts || postsJson.items || [];
      const postsPagination: Pagination = postsJson.pagination || {
        total: posts.length,
      };

      const comments: CommentItem[] =
        commentsJson.items || commentsJson.comments || [];
      const commentsPagination: Pagination = commentsJson.pagination || {
        total: comments.length,
      };

      setRecentPosts(posts);
      setTotalPosts(postsPagination.total || 0);

      setRecentComments(comments);
      setTotalComments(commentsPagination.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Admin overview — posts & comments.
          </p>
        </div>

        <Button variant="outline" onClick={loadDashboard} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "—" : totalPosts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Published + Draft + Scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "—" : totalComments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending + Approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Recent Posts</CardTitle>

            <Link
              href="/admin/posts"
              className="text-sm text-primary flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No posts yet.</p>
            ) : (
              <div className="space-y-5">
                {recentPosts.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-start justify-between gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {p.title}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>{p.status || "—"}</span>
                        <span>{fmtDateOnly(p.createdAt)}</span>
                      </div>
                    </div>

                    {/* চাইলে edit link */}
                    <Link
                      href={`/admin/posts/edit-post/${p._id}`}
                      className="text-xs text-primary hover:underline whitespace-nowrap"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Recent Comments</CardTitle>

            <Link
              href="/admin/comments"
              className="text-sm text-primary flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : recentComments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            ) : (
              <div className="space-y-5">
                {recentComments.slice(0, 4).map((c) => (
                  <div
                    key={c._id}
                    className="border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground truncate">
                        {c.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {fmtDateOnly(c.createdAt)}
                      </span>
                    </div>

                    {c.postTitle ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Post: <span className="font-medium">{c.postTitle}</span>
                      </p>
                    ) : null}

                    <p className="text-sm text-muted-foreground mt-2">
                      {shortText(c.message, 90)}
                    </p>

                    <p className="text-xs mt-2">
                      <span className="text-muted-foreground">Status: </span>
                      <span className="font-medium">{c.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// "use client";

// // import { AdminLayout } from "./layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowUpRight, Users, Eye, FileText, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function AdminDashboard() {
//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-serif font-bold text-foreground">
//           Dashboard
//         </h1>
//         <p className="text-muted-foreground mt-1">
//           Welcome back, Eleanor. Here's what's happening today.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card className="shadow-sm border-border/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Views
//             </CardTitle>
//             <Eye className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">45.2K</div>
//             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//               <span className="text-emerald-600 font-medium flex items-center">
//                 +12%
//               </span>{" "}
//               from last month
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="shadow-sm border-border/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Active Readers
//             </CardTitle>
//             <Users className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">1,240</div>
//             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//               <span className="text-emerald-600 font-medium flex items-center">
//                 +4%
//               </span>{" "}
//               from last hour
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="shadow-sm border-border/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Stories Published
//             </CardTitle>
//             <FileText className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">84</div>
//             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//               <span className="text-emerald-600 font-medium flex items-center">
//                 +3
//               </span>{" "}
//               this week
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="shadow-sm border-border/60">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Avg. Read Time
//             </CardTitle>
//             <Clock className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">4m 12s</div>
//             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//               <span className="text-emerald-600 font-medium flex items-center">
//                 +1.2%
//               </span>{" "}
//               from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <Card className="shadow-sm border-border/60">
//           <CardHeader>
//             <CardTitle className="font-serif">Recent Stories</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {[
//                 {
//                   title: "The Art of Slow Living",
//                   views: "2.4k",
//                   status: "Published",
//                 },
//                 {
//                   title: "Minimalist Architecture",
//                   views: "1.8k",
//                   status: "Published",
//                 },
//                 {
//                   title: "Sustainable Coffee Culture",
//                   views: "950",
//                   status: "Published",
//                 },
//                 {
//                   title: "Draft: Winter Collection",
//                   views: "-",
//                   status: "Draft",
//                 },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium text-foreground">{item.title}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {item.status}
//                     </p>
//                   </div>
//                   <div className="text-sm font-medium text-muted-foreground">
//                     {item.views} views
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 pt-6 border-t border-border">
//               <Button variant="outline" size="sm" className="w-full">
//                 View All Stories
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-border/60">
//           <CardHeader>
//             <CardTitle className="font-serif">Newsletter Growth</CardTitle>
//           </CardHeader>
//           <CardContent className="h-[300px] flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed border-border m-6 mt-0">
//             <p className="text-muted-foreground text-sm">Chart Placeholder</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
