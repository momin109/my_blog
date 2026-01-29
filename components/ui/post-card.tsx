import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  variant?: "featured" | "standard" | "compact" | "minimal";
  className?: string;
  slug: string; // for linking
}

export function PostCard({
  title,
  excerpt,
  image,
  category,
  author,
  date,
  readTime,
  variant = "standard",
  className,
  slug,
}: PostCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/posts/${slug}`}>
        <article
          className={cn(
            "group relative grid grid-cols-1 lg:grid-cols-12 gap-8 cursor-pointer",
            className,
          )}
        >
          <div className="lg:col-span-8 overflow-hidden rounded-2xl">
            <img
              src={image}
              alt={title}
              className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4 md:space-y-6">
            <Badge
              variant="secondary"
              className="w-fit px-3 py-1 text-xs font-medium tracking-wider uppercase bg-secondary text-primary hover:bg-secondary/80"
            >
              {category}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
              {title}
            </h2>
            <p className="text-muted-foreground leading-relaxed line-clamp-3 md:text-lg">
              {excerpt}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-background"
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium text-foreground">
                  {author.name}
                </span>
                <span className="text-muted-foreground flex items-center gap-2">
                  {date}{" "}
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />{" "}
                  {readTime}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/posts/${slug}`}>
        <article
          className={cn(
            "group flex gap-4 items-start cursor-pointer",
            className,
          )}
        >
          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {category}
            </span>
            <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </article>
      </Link>
    );
  }

  // Standard variant
  return (
    <Link href={`/posts/${slug}`}>
      <article
        className={cn(
          "group flex flex-col space-y-4 cursor-pointer",
          className,
        )}
      >
        <div className="overflow-hidden rounded-xl aspect-[4/3] bg-muted relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm border-none shadow-sm font-normal">
              {category}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {readTime}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>

          {excerpt && (
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2 group/author">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-6 h-6 rounded-full object-cover grayscale group-hover/author:grayscale-0 transition-all"
            />
            <span className="text-xs font-medium text-foreground/80">
              {author.name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
