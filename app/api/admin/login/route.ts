import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { dbConnect } from "@/lib/mongoos";
import Admin from "@/models/Admin";
import type { AdminJwtPayload } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };

    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email & password required" },
        { status: 400 },
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { message: "Missing JWT_SECRET" },
        { status: 500 },
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({ email }).lean();
    if (!admin || admin.isActive === false) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const payload: AdminJwtPayload = {
      sub: String(admin._id),
      role: "admin",
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

    const res = NextResponse.json({
      message: "Login success",
      admin: {
        id: String(admin._id),
        email: admin.email,
        name: admin.name ?? "Admin",
      },
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { dbConnect } from "@/lib/mongoos";
// import Admin from "@/models/Admin";
// import type { AdminJwtPayload } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const body = (await req.json()) as { email?: string; password?: string };
//     const email = body.email?.toLowerCase().trim();
//     const password = body.password;

//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email & password required" },
//         { status: 400 },
//       );
//     }

//     await dbConnect();

//     const admin = await Admin.findOne({ email });
//     if (!admin || admin.isActive === false) {
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 401 },
//       );
//     }

//     const ok = await bcrypt.compare(password, admin.passwordHash);
//     if (!ok)
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 401 },
//       );

//     const payload: AdminJwtPayload = {
//       sub: String((admin as any)._id),
//       role: "admin",
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "7d",
//     });

//     const res = NextResponse.json({
//       message: "Login success",
//       admin: {
//         id: String((admin as any)._id),
//         email: admin.email,
//         name: admin.name ?? "Admin",
//       },
//     });

//     res.cookies.set("admin_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });

//     return res;
//   } catch {
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
