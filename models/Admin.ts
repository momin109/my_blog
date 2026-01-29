import mongoose, { Schema, Model, models } from "mongoose";

export type AdminDoc = {
  email: string;
  passwordHash: string;
  name?: string;
  role?: "admin";
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const AdminSchema = new Schema<AdminDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Admin: Model<AdminDoc> =
  (models.Admin as Model<AdminDoc>) ||
  mongoose.model<AdminDoc>("Admin", AdminSchema);

export default Admin;
