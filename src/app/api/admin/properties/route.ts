import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  // Auth
  try {
    await getAdminFromSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    // Create property first to get propertyId for local uploads.
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        type: typeRaw,
        features,
      },
      select: { id: true },
    });

    const files = formData.getAll("images");
    const uploadDir = path.join(process.cwd(), "public", "uploads", "properties", property.id);
    await fs.mkdir(uploadDir, { recursive: true });

    const imagesToCreate: Array<{ url: string; altText?: string; sortOrder: number }> = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (typeof f === "string") continue;
      if ('size' in f && (f as File).size === 0) continue; // Skip empty files

      const safeName = (f as File).name.replace(/[^\w.\-]+/g, "_");
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;
      const bytes = Buffer.from(await (f as File).arrayBuffer());

      // Keep uploads reasonable (adjust later if needed)
      if (bytes.byteLength > 10 * 1024 * 1024) continue; // 10MB per file

      const filePath = path.join(uploadDir, uniqueName);
      await fs.writeFile(filePath, bytes);

      imagesToCreate.push({
        url: `/uploads/properties/${property.id}/${uniqueName}`,
        altText: "Örnek görsel",
        sortOrder: i,
      });
    }

    if (imagesToCreate.length > 0) {
      await prisma.propertyImage.createMany({
        data: imagesToCreate.map((img) => ({
          propertyId: property.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/properties");

    return NextResponse.json({ ok: true, id: property.id });
  } catch (err: any) {
    console.error("Error creating property:", err);
    return NextResponse.json({ error: "İlan oluşturulamadı, veritabanı hatası" }, { status: 500 });
  }
}

