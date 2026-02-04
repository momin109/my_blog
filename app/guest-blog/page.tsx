"use client";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  MessageSquare,
  Send,
  UploadCloud,
  ImagePlus,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { slugify } from "@/lib/slug";

export default function GuestBlog() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // guest info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // post fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string>(""); // comma separated
  const [coverUrl, setCoverUrl] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const slug = useMemo(() => slugify(title || "guest-story"), [title]);

  // ======= upload image (admin upload route reuse) ===========
  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Upload failed");
    return data.url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // basic validation
    if (!fullName.trim() || !email.trim() || !title.trim() || !content.trim()) {
      alert("Full Name, Email, Title, and Content are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/guest-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
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
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message || "Failed to submit. Please check fields.");
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4" /> Guest Writing
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Write for Editorial.
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Share your story with our community. We welcome thoughtful
            perspectives on design, culture, and slow living.
          </p>

          <p className="text-xs text-muted-foreground mt-3">
            Slug: <span className="font-mono">{slug}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Guidelines */}
          <div className="lg:col-span-5 space-y-8">
            <div className="prose prose-slate">
              <h3 className="font-serif text-2xl mb-4">
                Submission Guidelines
              </h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3 italic">
                  <span className="text-primary font-bold">01.</span> Original
                  content only. No copied content.
                </li>
                <li className="flex gap-3 italic">
                  <span className="text-primary font-bold">02.</span> Try to
                  keep it between 800 - 1,500 words.
                </li>
                <li className="flex gap-3 italic">
                  <span className="text-primary font-bold">03.</span> Focus on:
                  Minimalism, Design, Culture, Travel, Food.
                </li>
                <li className="flex gap-3 italic">
                  <span className="text-primary font-bold">04.</span> Add a
                  cover image (upload or URL) if possible.
                </li>
              </ul>
            </div>

            <Card className="bg-secondary/30 border-none">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Why guest
                  blog?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Your post will be reviewed by admin. If approved, it will be
                published on our website.
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-xl border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-2xl">
                  Submit Your Guest Post
                </CardTitle>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold">
                      Submission Received
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you! Our editorial team will review your post and
                      contact you via email.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFullName("");
                        setEmail("");
                        setTitle("");
                        setContent("");
                        setExcerpt("");
                        setCategory("");
                        setTags("");
                        setCoverUrl("");
                      }}
                    >
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Full Name</Label>
                        <Input
                          placeholder="John Doe"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Cover image */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Cover Image (optional)
                      </Label>

                      <div className="space-y-3">
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

                        <input
                          ref={fileRef}
                          id="guestCoverFile"
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
                              // ✅ safe reset
                              if (fileRef.current) fileRef.current.value = "";
                            }
                          }}
                        />

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={saving}
                            onClick={() =>
                              document.getElementById("guestCoverFile")?.click()
                            }
                            className="gap-2"
                          >
                            <UploadCloud className="w-4 h-4" />
                            {saving ? "Uploading..." : "Upload"}
                          </Button>

                          <Input
                            placeholder="Or paste image URL"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Story Title</Label>
                      <Input
                        placeholder="e.g. The Philosophy of Japanese Ceramics"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Excerpt (optional)
                      </Label>
                      <Textarea
                        placeholder="Short summary..."
                        className="min-h-[110px] resize-none"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    {/* Category + Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Category (optional)
                        </Label>
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

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Tags (optional)
                        </Label>
                        <Input
                          placeholder="comma separated: minimal, design"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Draft / Content
                      </Label>
                      <Textarea
                        placeholder="Write your story here..."
                        className="min-h-[250px] resize-none"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-medium group"
                      disabled={saving}
                    >
                      {saving ? "Submitting..." : "Submit Proposal"}
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Your submission will be saved as <b>Draft</b> and
                      published only after admin approval.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
