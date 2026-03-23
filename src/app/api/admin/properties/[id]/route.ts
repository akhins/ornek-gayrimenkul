import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/adminAuth";
import type { PropertyType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

function getSafeString(value: unknown) {
  return String(value ?? "").trim();
}

const allowedTypes = ["APARTMENT", "VILLA", "PENTHOUSE", "DUPLEX", "LAND"] as const;

function isPropertyType(value: string): value is PropertyType {
  return (allowedTypes as readonly string[]).includes(value);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await getAdminFromSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();

  const title = getSafeString(formData.get("title"));
  const description = getSafeString(formData.get("description"));
  const location = getSafeString(formData.get("location"));
  const typeRaw = getSafeString(formData.get("type"));
  const priceRaw = getSafeString(formData.get("price"));
  const featuresRaw = getSafeString(formData.get("features"));

  const price = Number(priceRaw);

  if (!title || !description || !location || !typeRaw || !Number.isFinite(price) || !isPropertyType(typeRaw)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  let features: string[] = [];
  try {
    const parsed = featuresRaw ? JSON.parse(featuresRaw) : [];
    features = Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    features = [];
  }

  try {
    await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        price,
        location,
        type: typeRaw,
        features,
        status: "ACTIVE",
      },
    });

    const files = formData.getAll("images");
    const validFiles = files.filter(f => typeof f !== "string" && ('size' in f && (f as File).size > 0));
    const hasNewImages = validFiles.length > 0;

    if (hasNewImages) {
      // Replace gallery completely if new images are provided
      const uploadDir = path.join(process.cwd(), "public", "uploads", "properties", id);
      await fs.rm(uploadDir, { recursive: true, force: true }).catch(() => null);
      await fs.mkdir(uploadDir, { recursive: true });

      await prisma.propertyImage.deleteMany({ where: { propertyId: id } });

      const imagesToCreate: Array<{ url: string; sortOrder: number }> = [];

      for (let i = 0; i < validFiles.length; i++) {
        const f = validFiles[i];
        if (typeof f === "string") continue;

        const safeName = (f as File).name.replace(/[^\w.\-]+/g, "_");
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;
        const bytes = Buffer.from(await (f as File).arrayBuffer());

        if (bytes.byteLength > 10 * 1024 * 1024) continue; // 10MB per file

        await fs.writeFile(path.join(uploadDir, uniqueName), bytes);
        imagesToCreate.push({
          url: `/uploads/properties/${id}/${uniqueName}`,
          sortOrder: i,
        });
      }

      if (imagesToCreate.length > 0) {
        await prisma.propertyImage.createMany({
          data: imagesToCreate.map((img) => ({
            propertyId: id,
            url: img.url,
            sortOrder: img.sortOrder,
            altText: "Örnek görsel",
          })),
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${id}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating property:", err);
    return NextResponse.json({ error: "Güncelleme başarısız oldu, veritabanı hatası" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await getAdminFromSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    // Remove local gallery directory (if it exists)
    const uploadDir = path.join(process.cwd(), "public", "uploads", "properties", id);
    await fs.rm(uploadDir, { recursive: true, force: true }).catch(() => null);

    await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/properties");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error deleting property:", err);
    return NextResponse.json({ error: "Silme işlemi başarısız oldu, veritabanı hatası" }, { status: 500 });
  }
}

