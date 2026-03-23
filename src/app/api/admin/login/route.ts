import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAllowedBootstrapAdmin,
  hashAdminPassword,
  signAdminSession,
  verifyAdminPassword,
} from "@/lib/adminAuth";

const COOKIE_NAME = "admin_session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

  let admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin) {
    const bootstrap = getAllowedBootstrapAdmin();
    const adminCount = await prisma.adminUser.count();
    const matchesBootstrap =
      email === bootstrap.email.toLowerCase() && password === bootstrap.password;

    if (adminCount === 0 && matchesBootstrap) {
      const passwordHash = await hashAdminPassword(password);
      admin = await prisma.adminUser.create({
        data: { email, passwordHash },
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const ok = await verifyAdminPassword(password, admin.passwordHash);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await signAdminSession({ sub: admin.id, email: admin.email });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // Cookie path'i "/" yapıyoruz ki /api/admin/... endpoint'lerine de cookie gelsin.
    // Aksi halde form submit'i sırasında Unauthorized oluşabiliyor.
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

