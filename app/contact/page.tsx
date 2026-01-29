"use client";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  function setField<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || "Failed to send");
      }

      setMsg("Message sent successfully ✅");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a story to share, a partnership inquiry, or just want to say
            hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-secondary/30 border-none shadow-none">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">
                    Email Us
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    For general inquiries and submissions
                  </p>
                  <a
                    href="mailto:hello@editorial.com"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    hello@editorial.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-none shadow-none">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">
                    Visit Us
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Our creative studio
                  </p>
                  <p className="font-medium">
                    123 Design District, Creative Ave
                    <br />
                    New York, NY 10012
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-none shadow-none">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Mon-Fri from 8am to 5pm
                  </p>
                  <p className="font-medium">+1 (555) 000-0000</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="font-serif font-bold text-2xl mb-6">
              Send a Message
            </h3>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  className="min-h-[150px]"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-12"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
              {msg ? (
                <p className="text-sm text-muted-foreground text-center">
                  {msg}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
