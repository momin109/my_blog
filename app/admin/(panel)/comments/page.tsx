"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CommentItem = {
  _id: string;
  postId: string;
  postSlug?: string; // optional (API থেকে দিলে দেখাতে সুবিধা)
  postTitle?: string; // optional
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "PENDING" | "APPROVED";
};

export default function AdminCommentsPage() {
  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/comments?page=1&limit=50", {
      cache: "no-store",
    });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approveComment(id: string) {
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || "Approve failed");
      return;
    }

    // UI update
    setItems((prev) =>
      prev.map((x) => (x._id === id ? { ...x, status: "APPROVED" } : x)),
    );
  }

  async function deleteComment(id: string) {
    const ok = confirm("Delete this comment?");
    if (!ok) return;

    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || "Delete failed");
      return;
    }

    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Comments</h1>
        <p className="text-muted-foreground">Review and approve comments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest comments</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b border-border">
                  <tr className="[&>th]:py-3 [&>th]:px-3 text-muted-foreground">
                    <th>Post</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-border/60 align-top"
                    >
                      {/* <td className="py-3 px-3">
                        <div className="font-medium">
                          {c.postTitle || c.postSlug || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.postSlug ? `/${c.postSlug}` : c.postId}
                        </div>
                      </td> */}
                      <td className="py-3 px-3 font-medium">
                        {c.postTitle || "—"}
                      </td>

                      <td className="py-3 px-3 font-medium">{c.name}</td>

                      <td className="py-3 px-3">
                        <a
                          className="hover:underline"
                          href={`mailto:${c.email}`}
                        >
                          {c.email}
                        </a>
                      </td>

                      <td className="py-3 px-3 max-w-[520px]">
                        <div className="whitespace-pre-wrap line-clamp-4">
                          {c.message}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-xs font-medium">{c.status}</span>
                      </td>

                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex justify-end items-center gap-2">
                          {c.status !== "APPROVED" && (
                            <Button
                              size="sm"
                              onClick={() => approveComment(c._id)}
                            >
                              Approve
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteComment(c._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
