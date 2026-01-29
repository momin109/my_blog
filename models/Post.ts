import mongoose, { Schema, Types } from "mongoose";

export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export type PostDoc = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  coverUrl?: string | null;
  status: PostStatus;
  views: number;
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const PostSchema = new Schema<PostDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String },
    tags: { type: [String], default: [] },
    coverUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "SCHEDULED"],
      default: "DRAFT",
    },
    views: { type: Number, default: 0 },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

PostSchema.index({ status: 1, createdAt: -1 });

export const Post =
  mongoose.models.Post || mongoose.model<PostDoc>("Post", PostSchema);
