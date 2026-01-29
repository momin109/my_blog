"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ যদি আপনার backend email-based হয়, এখানে username কে email হিসেবে ব্যবহার করুন
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ ensures cookie is accepted
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ সফল হলে dashboard এ
      router.push("/admin");
      router.refresh();

      // --- Mock login চাইলে এইটা ব্যবহার করতে পারেন ---
      // setTimeout(() => {
      //   setLoading(false);
      //   router.push("/admin");
      // }, 1000);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-6">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold">Admin Login</h1>
        <p className="text-muted-foreground mt-1">Sign in to manage stories.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
