import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditPropertyClient } from "@/components/admin/EditPropertyClient";
import styles from "../../adminPropertyEditorPage.module.css";

export default async function AdminPropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) redirect("/admin/properties");

  const prop = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!prop) redirect("/admin/properties");

  const initial = {
    title: prop.title,
    description: prop.description,
    price: prop.price,
    location: prop.location,
    type: prop.type,
    features: Array.isArray(prop.features)
      ? (prop.features as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    images: prop.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      sortOrder: img.sortOrder,
    })),
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <div className={styles.kicker}>İlan Düzenle</div>
          <h1 className={styles.title}>Galeriyi güncelleyin</h1>
          <div className={styles.sub}>Değişiklikler anında web sitesine yansıyacak.</div>
        </div>

        <Link className={`${styles.back} lift focus-ring`} href="/admin/properties">
          ← İlanlara Dön
        </Link>
      </div>

      <div className={`${styles.card} glass-soft`}>
        <EditPropertyClient id={prop.id} initial={initial} />
      </div>
    </div>
  );
}

