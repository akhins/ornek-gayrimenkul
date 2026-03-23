import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const propertyId = body.propertyId ? String(body.propertyId) : undefined;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email, message are required" }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      message,
      propertyId: propertyId || null,
    },
  });

  return NextResponse.json({ ok: true });
}

