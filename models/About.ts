import mongoose, { Schema } from "mongoose";

export type AboutDoc = {
  headingTop?: string; // "Our Story"
  title: string; // "Curating the Quiet Moments"
  subtitle?: string;

  heroImageUrl?: string;

  lead?: string;
  paragraphs: string[]; // main content paragraphs

  editorName?: string;
  editorRole?: string;
  editorBio?: string;
  editorImageUrl?: string;
  editorTwitterUrl?: string;

  updatedAt: Date;
  createdAt: Date;
};

const AboutSchema = new Schema<AboutDoc>(
  {
    headingTop: { type: String, default: "Our Story" },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },

    heroImageUrl: { type: String, default: "" },

    lead: { type: String, default: "" },
    paragraphs: { type: [String], default: [] },

    editorName: { type: String, default: "" },
    editorRole: { type: String, default: "" },
    editorBio: { type: String, default: "" },
    editorImageUrl: { type: String, default: "" },
    editorTwitterUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export const About =
  mongoose.models.About || mongoose.model<AboutDoc>("About", AboutSchema);
