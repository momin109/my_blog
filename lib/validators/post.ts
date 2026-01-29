import { z } from "zod";

export const postCreateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
});

export const postUpdateSchema = postCreateSchema.partial();
