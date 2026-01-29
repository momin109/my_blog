import mongoose, { Schema, models, model } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    subject: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },

    // optional metadata
    ip: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ["NEW", "READ"], default: "NEW" },
  },
  { timestamps: true },
);

export const Contact = models.Contact || model("Contact", ContactSchema);
