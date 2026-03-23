import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type AdminSessionPayload = {
  sub: string;
  email: string;
};

const COOKIE_NAME = "admin_session";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET ?? "dev-admin-jwt-secret-change-me";

export async function hashAdminPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyAdminPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function signAdminSession(payload: AdminSessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const { payload } = await jwtVerify<AdminSessionPayload>(token, new TextEncoder().encode(JWT_SECRET));
  if (!payload?.sub || !payload?.email) throw new Error("UNAUTHORIZED");
  return payload;
}

export async function getAdminFromSession() {
  const session = await requireAdminSession();
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true },
  });
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

export function getAllowedBootstrapAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Admin credentials are not set in the environment variables (.env). Please set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }
  
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  };
}

