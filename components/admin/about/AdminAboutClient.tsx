"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

type AboutData = {
  headingTop?: string;
  title: string;
  subtitle?: string;

  heroImageUrl?: string;

  lead?: string;
  paragraphs: string[];

  editorName?: string;
  editorRole?: string;
  editorBio?: string;
  editorImageUrl?: string;
  editorTwitterUrl?: string;
};

export default function AdminAboutClient() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);

  const heroFileRef = useRef<HTMLInputElement | null>(null);
  const editorFileRef = useRef<HTMLInputElement | null>(null);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j?.message || "Upload failed");
    return j.url as string;
  }

  async function load() {
    const res = await fetch("/api/admin/about", { cache: "no-store" });
    const j = await res.json().catch(() => ({}));
    setData(j.about);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(j?.message || "Save failed");
        return;
      }
      alert("Saved ✅");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">About Page</h1>
        <p className="text-muted-foreground">
          Edit about page content & images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Top Label</Label>
                <Input
                  value={data.headingTop || ""}
                  onChange={(e) =>
                    setData({ ...data, headingTop: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={data.subtitle || ""}
                  onChange={(e) =>
                    setData({ ...data, subtitle: e.target.value })
                  }
                  className="min-h-[110px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Hero Image</Label>
                {data.heroImageUrl ? (
                  <img
                    src={data.heroImageUrl}
                    alt="hero"
                    className="w-full aspect-[16/9] rounded-xl object-cover border"
                  />
                ) : null}

                <input
                  ref={heroFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setSaving(true);
                      const url = await uploadImage(file);
                      setData({ ...data, heroImageUrl: url });
                    } catch (err: any) {
                      alert(err?.message || "Upload failed");
                    } finally {
                      setSaving(false);
                      if (heroFileRef.current) heroFileRef.current.value = "";
                    }
                  }}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => heroFileRef.current?.click()}
                    className="gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload
                  </Button>

                  <Input
                    placeholder="Or paste image URL"
                    value={data.heroImageUrl || ""}
                    onChange={(e) =>
                      setData({ ...data, heroImageUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lead</Label>
                <Textarea
                  value={data.lead || ""}
                  onChange={(e) => setData({ ...data, lead: e.target.value })}
                  className="min-h-[110px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Paragraphs (one per line)</Label>
                <Textarea
                  value={(data.paragraphs || []).join("\n\n")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      paragraphs: e.target.value
                        .split("\n\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="min-h-[220px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editor Box</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Editor Name</Label>
                <Input
                  value={data.editorName || ""}
                  onChange={(e) =>
                    setData({ ...data, editorName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={data.editorRole || ""}
                  onChange={(e) =>
                    setData({ ...data, editorRole: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={data.editorBio || ""}
                  onChange={(e) =>
                    setData({ ...data, editorBio: e.target.value })
                  }
                  className="min-h-[140px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Editor Image</Label>
                {data.editorImageUrl ? (
                  <img
                    src={data.editorImageUrl}
                    alt="editor"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : null}

                <input
                  ref={editorFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setSaving(true);
                      const url = await uploadImage(file);
                      setData({ ...data, editorImageUrl: url });
                    } catch (err: any) {
                      alert(err?.message || "Upload failed");
                    } finally {
                      setSaving(false);
                      if (editorFileRef.current)
                        editorFileRef.current.value = "";
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  className="gap-2"
                  onClick={() => editorFileRef.current?.click()}
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              <div className="space-y-2">
                <Label>facebook URL (optional)</Label>
                <Input
                  value={data.editorTwitterUrl || ""}
                  onChange={(e) =>
                    setData({ ...data, editorTwitterUrl: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>

              <Button disabled={saving} onClick={save} className="w-full">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
