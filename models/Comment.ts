import mongoose, { Schema, Types } from "mongoose";

export type CommentStatus = "PENDING" | "APPROVED";

export type CommentDoc = {
  _id: Types.ObjectId;

  // ✅ কোন পোস্টে এই কমেন্ট, সেটার reference
  postId: Types.ObjectId;

  // guest info (login ছাড়াই)
  name: string;
  email: string; // public দেখাবেন না
  message: string;

  status: CommentStatus;

  createdAt: Date;
  updatedAt: Date;
};

const CommentSchema = new Schema<CommentDoc>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true },
);

// দ্রুত লোডের জন্য (একটা পোস্টের approved কমেন্টগুলো নতুনটা আগে)
CommentSchema.index({ postId: 1, status: 1, createdAt: -1 });

export const Comment =
  mongoose.models.Comment ||
  mongoose.model<CommentDoc>("Comment", CommentSchema);
