import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AdminJwtPayload } from "@/lib/auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AdminJwtPayload;

    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}
