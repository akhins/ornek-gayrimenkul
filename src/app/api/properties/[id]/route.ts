import { NextRequest, NextResponse } from "next/server";
import { getPublicPropertyById } from "@/lib/properties";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const property = await getPublicPropertyById(id);
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

