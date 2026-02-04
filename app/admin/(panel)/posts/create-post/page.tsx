"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImagePlus, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { slugify } from "@/lib/slug";

type Status = "DRAFT" | "PUBLISHED";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string>(""); // comma separated
  const [coverUrl, setCoverUrl] = useState<string>(""); // uploaded url or manual url
  const [saving, setSaving] = useState(false);

  const slug = useMemo(() => slugify(title || "new-story"), [title]);

  // ======= upload image ===========
  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Upload failed");

    return data.url as string; // cloudinary secure_url
  }

  async function submit(status: Status) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          category: category || undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          coverUrl: coverUrl || undefined,
          status,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message || "Failed to save. Check required fields.");
        return;
      }

      const id = data?.post?._id || data?.post?.id;
      window.location.href = `/admin/posts/edit-post/${id}`;
    } catch (err: any) {
      alert(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              New Story
            </h1>
            <p className="text-muted-foreground mt-1">
              Write something beautiful.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Slug: <span className="font-mono">{slug}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => submit("DRAFT")}
          >
            Save Draft
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            disabled={saving}
            onClick={() => submit("PUBLISHED")}
          >
            <UploadCloud className="w-4 h-4" /> Publish
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4 ">
            <Input
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
    text-4xl font-serif font-bold
    px-3 py-2 h-auto
    border-2
    rounded-md
    hover:border-2 hover:border-primary
    focus:border-2 focus:border-primary
    focus-visible:ring-0
    placeholder:text-muted-foreground/40
  "
            />
            <Textarea
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="
    min-h-[500px] resize-none
    text-lg leading-relaxed
    px-3 py-3
    border-2
    rounded-md
    hover:border-2 hover:border-primary
    focus:border-2 focus:border-primary
    focus-visible:ring-0
    placeholder:text-muted-foreground/40
  "
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>

              <div className="space-y-3">
                {/* preview */}
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="w-full aspect-video rounded-lg object-cover border"
                  />
                ) : (
                  <div className="aspect-video bg-secondary/30 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm">Upload cover</span>
                  </div>
                )}

                {/* hidden file input */}
                <input
                  id="coverFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      setSaving(true);
                      const url = await uploadImage(file);
                      setCoverUrl(url);
                    } catch (err: any) {
                      alert(err?.message || "Upload failed");
                    } finally {
                      setSaving(false);
                      e.currentTarget.value = "";
                    }
                  }}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() =>
                      document.getElementById("coverFile")?.click()
                    }
                    className="gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {saving ? "Uploading..." : "Upload"}
                  </Button>

                  <Input
                    placeholder="Or paste image URL (optional)"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            {/* Excerpt */}
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                placeholder="Short summary..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="h-24 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Add tags (comma separated)..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Debug (optional) */}
            {/* <p className="text-xs text-muted-foreground break-all">
              coverUrl: {coverUrl}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
