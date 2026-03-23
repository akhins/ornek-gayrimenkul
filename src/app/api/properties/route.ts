import { NextResponse } from "next/server";
import { listPublicProperties } from "@/lib/properties";
import type { PropertyType as PrismaPropertyType } from "@prisma/client";

const allowedTypes = ["APARTMENT", "VILLA", "PENTHOUSE", "DUPLEX", "LAND"] as const;

function isPropertyType(value: string): value is PrismaPropertyType {
  return (allowedTypes as readonly string[]).includes(value);
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type") ?? "ALL";
  const type = typeParam !== "ALL" && isPropertyType(typeParam) ? typeParam : "ALL";
  const location = url.searchParams.get("location") ?? "";
  const minPriceRaw = url.searchParams.get("minPrice");
  const maxPriceRaw = url.searchParams.get("maxPrice");
  const q = url.searchParams.get("q") ?? "";

  const minPrice =
    minPriceRaw && minPriceRaw.trim().length > 0 ? Number(minPriceRaw) : undefined;
  const maxPrice =
    maxPriceRaw && maxPriceRaw.trim().length > 0 ? Number(maxPriceRaw) : undefined;

  const properties = await listPublicProperties({
    type,
    location: location || undefined,
    minPrice: typeof minPrice === "number" && Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: typeof maxPrice === "number" && Number.isFinite(maxPrice) ? maxPrice : undefined,
    q: q || undefined,
  });

  return NextResponse.json({ properties });
}

