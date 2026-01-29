// import { Link } from "wouter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-8xl md:text-9xl font-serif font-bold text-primary/20 mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          The story you are looking for seems to have been moved or doesn't
          exist. Let's get you back to the beginning.
        </p>

        <Link href="/">
          <Button size="lg" className="rounded-full px-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
