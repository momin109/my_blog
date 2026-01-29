import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { dbConnect } from "../lib/mongoos";
import Admin from "@/models/Admin";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email) throw new Error("Missing ADMIN_EMAIL");
  if (!password) throw new Error("Missing ADMIN_PASSWORD");

  await dbConnect();

  const existing = await Admin.findOne({ email }).lean();
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({
    name,
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`✅ Admin created: ${email}`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
  });
