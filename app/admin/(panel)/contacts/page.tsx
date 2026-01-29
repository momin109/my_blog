"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ContactItem = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "NEW" | "READ";
};

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/contact?page=1&limit=50", {
      cache: "no-store",
    });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteContact(id: string) {
    const ok = confirm("Delete this contact message?");
    if (!ok) return;

    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || "Delete failed");
      return;
    }

    // UI থেকে সাথে সাথে remove
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Contacts</h1>
        <p className="text-muted-foreground">Who contacted you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest messages</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No messages yet.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b border-border">
                  <tr className="[&>th]:py-3 [&>th]:px-3 text-muted-foreground">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th className="text-right">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-border/60 align-top"
                    >
                      <td className="py-3 px-3 font-medium">{c.firstName}</td>
                      <td className="py-3 px-3">{c.lastName}</td>
                      <td className="py-3 px-3">
                        <a
                          className="hover:underline"
                          href={`mailto:${c.email}`}
                        >
                          {c.email}
                        </a>
                      </td>
                      <td className="py-3 px-3 font-medium">{c.subject}</td>
                      <td className="py-3 px-3 max-w-[420px]">
                        <div className="whitespace-pre-wrap line-clamp-4">
                          {c.message}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteContact(c._id)}
                        >
                          Delete
                        </Button>
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
