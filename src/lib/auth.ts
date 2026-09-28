import { cookies } from "next/headers";
import db from "./db";
import bcrypt from "bcryptjs";

const AUTH_COOKIE_NAME = "wbre_admin_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setAdminSession(user: SessionUser) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 * 7, // 7 days
  });

  // Base64 encode session cookie
  const encoded = Buffer.from(sessionData).toString("base64");

  cookieStore.set(AUTH_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const session = JSON.parse(decoded);

    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null;
    }

    // Verify user exists in DB and is active
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Auth session check error:", error);
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
