"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GuestInfo = { name?: string; email?: string };

type GuestPostItem = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  guest?: GuestInfo;
};

export default function AdminGuestPostsClient() {
  const [items, setItems] = useState<GuestPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/guest-posts?page=1&limit=50", {
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approvePost(id: string) {
    const res = await fetch(`/api/admin/guest-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PUBLISHED" }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || "Approve failed");
      return;
    }

    // UI update
    setItems((prev) =>
      prev.map((x) => (x._id === id ? { ...x, status: "PUBLISHED" } : x)),
    );
  }

  async function deletePost(id: string) {
    const ok = confirm("Delete this guest post?");
    if (!ok) return;

    const res = await fetch(`/api/admin/guest-posts/${id}`, {
      method: "DELETE",
    });

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
        <h1 className="text-3xl font-serif font-bold">Guest Posts</h1>
        <p className="text-muted-foreground">
          Approve or delete guest submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest guest submissions</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No guest posts yet.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b border-border">
                  <tr className="[&>th]:py-3 [&>th]:px-3 text-muted-foreground">
                    <th>Title</th>
                    <th>Guest Name</th>
                    <th>Guest Email</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-border/60 align-top"
                    >
                      <td className="py-3 px-3 font-medium">{p.title}</td>

                      <td className="py-3 px-3">{p.guest?.name || "—"}</td>

                      <td className="py-3 px-3">
                        {p.guest?.email ? (
                          <a
                            className="hover:underline"
                            href={`mailto:${p.guest.email}`}
                          >
                            {p.guest.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-xs font-medium">{p.status}</span>
                      </td>

                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex justify-end items-center gap-2">
                          {p.status !== "PUBLISHED" && (
                            <Button
                              size="sm"
                              onClick={() => approvePost(p._id)}
                            >
                              Approve
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePost(p._id)}
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
