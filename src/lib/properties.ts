import type { Property, PropertyImage, PropertyType as PrismaPropertyType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicProperty = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: PrismaPropertyType;
  features: string[];
  images: Array<Pick<PropertyImage, "id" | "url" | "altText" | "sortOrder">>;
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string") as string[];
  return [];
}

function toPublicProperty(
  p: Property & { images: Array<PropertyImage> },
): PublicProperty {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    location: p.location,
    type: p.type,
    features: asStringArray(p.features),
    images: p.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
      })),
  };
}

const DEMO_IMAGES = [
  // Premium-looking remote images (used only when DB is empty)
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0defaced?auto=format&fit=crop&w=1600&q=80",
];

const DEMO_PROPERTIES: PublicProperty[] = [
  {
    id: "demo-1",
    title: "Bosphorus Skyline Residence",
    description: "Deniz manzaralı, yüksek tavanlı modern daire. Özenle tasarlanmış yaşam alanları.",
    price: 12500000,
    location: "Beşiktaş, İstanbul",
    type: "APARTMENT",
    features: ["Deniz manzarası", "Giyinme odası", "Akıllı ev altyapısı", "Otopark"],
    images: DEMO_IMAGES.map((url, i) => ({
      id: `demo-1-img-${i}`,
      url,
      altText: "Örnek görsel",
      sortOrder: i,
    })),
  },
  {
    id: "demo-2",
    title: "Villa Serenity - Özel Bahçe",
    description: "Geniş bahçe, premium malzeme seçimi ve sessiz lokasyon. Gün doğumuna uyan klasik modern çizgi.",
    price: 24500000,
    location: "Çekmeköy, İstanbul",
    type: "VILLA",
    features: ["Özel bahçe", "Şömine", "Geniş teras", "Güvenlik altyapısı"],
    images: DEMO_IMAGES.map((url, i) => ({
      id: `demo-2-img-${i}`,
      url: url + "&sat=-10",
      altText: "Örnek görsel",
      sortOrder: i,
    })),
  },
  {
    id: "demo-3",
    title: "The Penthouse Atelier",
    description: "Şehir ışıklarını izleyen ferah teras. Büyük camlar ve minimal iç mimari.",
    price: 31000000,
    location: "Kadıköy, İstanbul",
    type: "PENTHOUSE",
    features: ["Teras", "Panoramik cam", "Özel asansör", "Premium mutfak"],
    images: DEMO_IMAGES.map((url, i) => ({
      id: `demo-3-img-${i}`,
      url: url + "&blur=0",
      altText: "Örnek görsel",
      sortOrder: i,
    })),
  },
];

export async function getActivePropertiesCount() {
  if (!process.env.DATABASE_URL) return 0;
  return prisma.property.count({
    where: { status: "ACTIVE" },
  });
}

export async function listPublicProperties(filters?: {
  type?: PrismaPropertyType | "ALL";
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}): Promise<PublicProperty[]> {
  const count = await getActivePropertiesCount();
  if (count === 0) return DEMO_PROPERTIES;

  const where: Prisma.PropertyWhereInput = { status: "ACTIVE" };

  if (filters?.type && filters.type !== "ALL") where.type = filters.type;
  if (filters?.location && filters.location.trim().length > 0) {
    where.location = { contains: filters.location.trim() };
  }

  const price: Prisma.IntFilter = {};
  let hasPrice = false;
  if (typeof filters?.minPrice === "number" && Number.isFinite(filters.minPrice)) {
    price.gte = filters.minPrice;
    hasPrice = true;
  }
  if (typeof filters?.maxPrice === "number" && Number.isFinite(filters.maxPrice)) {
    price.lte = filters.maxPrice;
    hasPrice = true;
  }
  if (hasPrice) where.price = price;

  if (filters?.q && filters.q.trim().length > 0) {
    where.OR = [
      { title: { contains: filters.q.trim() } },
      { description: { contains: filters.q.trim() } },
    ];
  }

  const props = await prisma.property.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return props.map(toPublicProperty);
}

export async function getPublicPropertyById(id: string): Promise<PublicProperty | null> {
  if (!process.env.DATABASE_URL) return DEMO_PROPERTIES.find((p) => p.id === id) || null;
  
  const prop = await prisma.property.findFirst({
    where: { id, status: "ACTIVE" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!prop) return null;
  return toPublicProperty(prop);
}

