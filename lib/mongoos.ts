import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");

const MONGODB_URI_STR: string = MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

if (!globalAny.mongoose) {
  globalAny.mongoose = { conn: null, promise: null } as MongooseCache;
}

const cached: MongooseCache = globalAny.mongoose;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI_STR, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
