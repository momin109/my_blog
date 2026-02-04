"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImagePlus, UploadCloud, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { slugify } from "@/lib/slug";

type Status = "DRAFT" | "PUBLISHED" | "SCHEDULED";

type PostData = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  coverUrl?: string | null;
  status: Status;
};

type Notice = {
  type: "success" | "error" | "info";
  text: string;
};

export default function EditPost() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState<Notice | null>(null);

  const computedSlug = useMemo(() => slugify(data?.title || ""), [data?.title]);

  function showNotice(n: Notice, autoHideMs = 3500) {
    setNotice(n);
    if (autoHideMs > 0) {
      window.setTimeout(() => setNotice(null), autoHideMs);
    }
  }

  async function load() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        showNotice(
          { type: "error", text: "Post not found. Redirecting..." },
          2000,
        );
        window.setTimeout(() => {
          window.location.href = "/admin/posts";
        }, 800);
        return;
      }

      const p = json.post;
      setData({
        _id: p._id ?? p.id,
        title: p.title,
        slug: p.slug,
        content: p.content,
        excerpt: p.excerpt ?? "",
        category: p.category ?? "",
        tags: p.tags ?? [],
        coverUrl: p.coverUrl ?? null,
        status: p.status ?? "DRAFT",
      });
    } catch {
      showNotice(
        { type: "error", text: "Failed to load post. Please refresh." },
        0,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function update(status?: Status) {
    if (!data) return;

    setSaving(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || undefined,
          category: data.category || undefined,
          tags: data.tags,
          coverUrl: data.coverUrl || undefined,
          status: status ?? data.status,
          slug: computedSlug || data.slug,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to update. Please try again.";
        try {
          const err = await res.json();
          msg = err?.error || err?.message || msg;
        } catch {}
        showNotice({ type: "error", text: msg }, 0);
        return;
      }

      const json = await res.json();
      const p = json.post;

      setData((prev) =>
        prev
          ? {
              ...prev,
              slug: p.slug,
              status: p.status,
            }
          : prev,
      );

      showNotice({ type: "success", text: "Saved successfully ✅" });
    } catch {
      showNotice(
        { type: "error", text: "Network error. Please try again." },
        0,
      );
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const ok = window.confirm(
      "Delete this story? This action cannot be undone.",
    );
    if (!ok) return;

    setSaving(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });

      if (!res.ok) {
        let msg = "Failed to delete.";
        try {
          const err = await res.json();
          msg = err?.error || err?.message || msg;
        } catch {}
        showNotice({ type: "error", text: msg }, 0);
        return;
      }

      showNotice(
        { type: "success", text: "Deleted successfully. Redirecting..." },
        1500,
      );
      window.setTimeout(() => {
        window.location.href = "/admin/posts";
      }, 700);
    } catch {
      showNotice(
        { type: "error", text: "Network error. Please try again." },
        0,
      );
    } finally {
      setSaving(false);
    }
  }

  const noticeStyles =
    notice?.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : notice?.type === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  if (loading || !data) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading post...
      </div>
    );
  }

  return (
    <div>
      {/* Top Notice */}
      {notice && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${noticeStyles}`}
          role="status"
          aria-live="polite"
        >
          {notice.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon" aria-label="Back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Edit Story
              </h1>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                {data.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Slug:{" "}
              <span className="font-mono">{computedSlug || data.slug}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            type="button"
            onClick={onDelete}
            disabled={saving}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => update("DRAFT")}
            disabled={saving}
          >
            Save Draft
          </Button>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            type="button"
            onClick={() => update("PUBLISHED")}
            disabled={saving}
          >
            <UploadCloud className="w-4 h-4" /> Update
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Input
              value={data.title}
              onChange={(e) =>
                setData((p) => (p ? { ...p, title: e.target.value } : p))
              }
              placeholder="Post title"
              className="text-4xl font-serif font-bold border-none px-0 shadow-none h-auto placeholder:text-muted-foreground/30 focus-visible:ring-0 bg-transparent"
            />

            <Textarea
              value={data.content}
              onChange={(e) =>
                setData((p) => (p ? { ...p, content: e.target.value } : p))
              }
              placeholder="Start writing here..."
              className="min-h-[500px] resize-none border-none p-0 shadow-none text-lg leading-relaxed focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label>Cover Image</Label>

              <div className="aspect-video bg-secondary/30 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative group">
                {data.coverUrl ? (
                  <>
                    <Image
                      src={data.coverUrl}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
                      Cover URL in input below
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm">Use URL for now</span>
                  </div>
                )}
              </div>

              <Input
                placeholder="Cover image URL (optional)"
                value={data.coverUrl ?? ""}
                onChange={(e) =>
                  setData((p) => (p ? { ...p, coverUrl: e.target.value } : p))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={data.category ?? ""}
                onChange={(e) =>
                  setData((p) => (p ? { ...p, category: e.target.value } : p))
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select category...</option>
                <option>Design</option>
                <option>Lifestyle</option>
                <option>Culture</option>
                <option>Travel</option>
                <option>Food</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={data.excerpt ?? ""}
                onChange={(e) =>
                  setData((p) => (p ? { ...p, excerpt: e.target.value } : p))
                }
                className="h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={(data.tags ?? []).join(", ")}
                onChange={(e) =>
                  setData((p) =>
                    p
                      ? {
                          ...p,
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        }
                      : p,
                  )
                }
                placeholder="comma, separated, tags"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={data.status}
                onChange={(e) =>
                  setData((p) =>
                    p ? { ...p, status: e.target.value as Status } : p,
                  )
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </select>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => update()}
                disabled={saving}
              >
                Save Changes (keep status)
              </Button>
            </div>

            <div className="pt-2">
              <Link href={`/post/${computedSlug || data.slug}`}>
                <Button variant="ghost" className="w-full">
                  View Live (slug)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
