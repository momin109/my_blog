"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type CommentItem = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
};

type Notice = {
  type: "success" | "error" | "info";
  text: string;
};

export function CommentsUI({ slug }: { slug: string }) {
  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [notice, setNotice] = useState<Notice | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) setItems(data.comments || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          text: data?.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setName("");
      setEmail("");
      setMessage("");

      setNotice({
        type: "success",
        text: "Thanks! Your comment was submitted and is waiting for admin approval.",
      });

      await load();

      // চাইলে 4 সেকেন্ড পর মেসেজ auto-hide
      setTimeout(() => setNotice(null), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  const noticeStyles =
    notice?.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : notice?.type === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div className="mt-20 pt-10 border-t border-border not-prose">
      <h3 className="text-3xl font-serif font-bold mb-8">
        Thoughts & Comments
      </h3>

      <Card className="bg-secondary/20 border-none shadow-none mb-10">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Leave a comment</CardTitle>
        </CardHeader>

        <CardContent>
          {/* সুন্দর inline message */}
          {notice && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 text-sm ${noticeStyles}`}
              role="status"
              aria-live="polite"
            >
              {notice.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
                required
              />
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[120px] bg-background"
              required
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="space-y-6">
          {items.map((c) => (
            <div key={c._id} className="border-b border-border/50 pb-4">
              <p className="font-semibold">{c.name}</p>
              <p className="text-muted-foreground">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
