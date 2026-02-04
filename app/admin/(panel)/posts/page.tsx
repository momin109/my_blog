"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type PostRow = {
  _id: string;
  title: string;
  category?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  createdAt: string;
  updatedAt: string;
  views: number;
  slug: string;
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return d;
  }
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | "PUBLISHED" | "DRAFT">("");

  // debounce search input a bit (simple)
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setQ(searchValue.trim()), 350);
    return () => clearTimeout(t);
  }, [searchValue]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/posts?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      setPosts(
        (data?.posts ?? []).map((p: any) => ({ ...p, _id: p._id ?? p.id })),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  const statusLabel = useMemo(() => {
    if (status === "PUBLISHED") return "Published";
    if (status === "DRAFT") return "Drafts";
    return "All";
  }, [status]);

  async function onDelete(postId: string) {
    const ok = confirm("Delete this story? This action cannot be undone.");
    if (!ok) return;

    const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete. Try again.");
      return;
    }
    setPosts((p) => p.filter((x) => x._id !== postId));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Stories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your publications and drafts.
          </p>
        </div>
        <Link href="/admin/posts/create-post">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create New Story
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            className="pl-9 bg-background"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={status === "" ? "outline" : "ghost"}
            className={status === "" ? "" : "text-muted-foreground"}
            onClick={() => setStatus("")}
          >
            All
          </Button>
          <Button
            variant={status === "PUBLISHED" ? "outline" : "ghost"}
            className={status === "PUBLISHED" ? "" : "text-muted-foreground"}
            onClick={() => setStatus("PUBLISHED")}
          >
            Published
          </Button>
          <Button
            variant={status === "DRAFT" ? "outline" : "ghost"}
            className={status === "DRAFT" ? "" : "text-muted-foreground"}
            onClick={() => setStatus("DRAFT")}
          >
            Drafts
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Loading {statusLabel}...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No stories found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id} className="hover:bg-secondary/10">
                  <TableCell className="font-medium">
                    <span className="block text-foreground">{post.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {post.slug}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-normal bg-background"
                    >
                      {post.category || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        post.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : post.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                      )}
                    >
                      {post.status === "PUBLISHED"
                        ? "Published"
                        : post.status === "DRAFT"
                          ? "Draft"
                          : "Scheduled"}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(post.updatedAt || post.createdAt)}
                  </TableCell>

                  {/* <TableCell className="text-right text-muted-foreground">
                    {(post.views ?? 0).toLocaleString()}
                  </TableCell> */}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {/* <Link href={`/post/${post.slug}`}>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" /> View Live
                          </DropdownMenuItem>
                        </Link> */}

                        <Link href={`/admin/posts/edit-post/${post._id}`}>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem
                          className="gap-2 text-destructive cursor-pointer"
                          onClick={() => onDelete(post._id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// "use client";

// // import { AdminLayout } from "./layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// // import { Link } from "wouter";
// import Link from "next/link";

// const POSTS = [
//   {
//     id: 1,
//     title: "The Art of Slow Living",
//     category: "Lifestyle",
//     status: "Published",
//     date: "Oct 24, 2025",
//     views: 2450,
//   },
//   {
//     id: 2,
//     title: "Minimalist Architecture",
//     category: "Design",
//     status: "Published",
//     date: "Oct 22, 2025",
//     views: 1830,
//   },
//   {
//     id: 3,
//     title: "Sustainable Coffee Culture",
//     category: "Food",
//     status: "Published",
//     date: "Oct 20, 2025",
//     views: 950,
//   },
//   {
//     id: 4,
//     title: "Typography Trends 2026",
//     category: "Design",
//     status: "Draft",
//     date: "Updated 2h ago",
//     views: 0,
//   },
//   {
//     id: 5,
//     title: "Kyoto Travel Guide",
//     category: "Travel",
//     status: "Scheduled",
//     date: "Nov 1, 2025",
//     views: 0,
//   },
//   {
//     id: 6,
//     title: "Future of Print",
//     category: "Culture",
//     status: "Published",
//     date: "Oct 12, 2025",
//     views: 1200,
//   },
// ];

// export default function AdminPosts() {
//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Stories
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your publications and drafts.
//           </p>
//         </div>
//         <Link href="/admin/posts/create-post">
//           <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//             Create New Story
//           </Button>
//         </Link>
//       </div>

//       <div className="flex items-center gap-4 mb-6">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search stories..."
//             className="pl-9 bg-background"
//           />
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline">All</Button>
//           <Button variant="ghost" className="text-muted-foreground">
//             Published
//           </Button>
//           <Button variant="ghost" className="text-muted-foreground">
//             Drafts
//           </Button>
//         </div>
//       </div>

//       <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-secondary/30 hover:bg-secondary/30">
//               <TableHead className="w-[400px]">Title</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead className="text-right">Views</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {POSTS.map((post) => (
//               <TableRow key={post.id} className="hover:bg-secondary/10">
//                 <TableCell className="font-medium">
//                   <span className="block text-foreground">{post.title}</span>
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     variant="outline"
//                     className="font-normal bg-background"
//                   >
//                     {post.category}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <span
//                     className={cn(
//                       "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
//                       post.status === "Published"
//                         ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
//                         : post.status === "Draft"
//                           ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
//                           : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//                     )}
//                   >
//                     {post.status}
//                   </span>
//                 </TableCell>
//                 <TableCell className="text-muted-foreground text-sm">
//                   {post.date}
//                 </TableCell>
//                 <TableCell className="text-right text-muted-foreground">
//                   {post.views.toLocaleString()}
//                 </TableCell>
//                 <TableCell>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-muted-foreground"
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <Link href={`/post/${post.id}`}>
//                         <DropdownMenuItem className="gap-2 cursor-pointer">
//                           <Eye className="h-4 w-4" /> View Live
//                         </DropdownMenuItem>
//                       </Link>
//                       <Link href={`/admin/posts/edit-post/${post.id}`}>
//                         <DropdownMenuItem className="gap-2 cursor-pointer">
//                           <Edit className="h-4 w-4" /> Edit
//                         </DropdownMenuItem>
//                       </Link>
//                       <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
//                         <Trash2 className="h-4 w-4" /> Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// // Utility for status styling (copied because I can't import easily in one-shot file creation without verifying path)
// function cn(...classes: (string | undefined | null | false)[]) {
//   return classes.filter(Boolean).join(" ");
// }
