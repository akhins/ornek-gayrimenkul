import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import styles from "./adminPropertiesPage.module.css";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminPropertyRow = {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "APARTMENT" | "VILLA" | "PENTHOUSE" | "DUPLEX" | "LAND";
  images: Array<{ url: string }>;
};

export default async function AdminPropertiesPage() {
  const properties = (await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  })) as unknown as AdminPropertyRow[];

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div>
          <div className={styles.kicker}>İlan Yönetimi</div>
          <h1 className={styles.title}>Gayrimenkuller</h1>
          <div className={styles.sub}>Yeni ilan ekleyin, düzenleyin veya galerileri yönetin.</div>
        </div>

        <div className={styles.topActions}>
          <Link className={`${styles.btn} lift focus-ring`} href="/admin/properties/new">
            Yeni İlan
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {properties.length === 0 ? (
          <div className={`${styles.empty} glass-soft`}>
            <div className={styles.emptyTitle}>Henüz ilan yok.</div>
            <div className={styles.emptySub}>İlk ilanınızı ekleyin, web sitesi otomatik güncellenecek.</div>
            <Link className={`${styles.btn} ${styles.btnGhost} lift focus-ring`} href="/admin/properties/new">
              İlk İlanı Ekle
            </Link>
          </div>
        ) : null}

        {properties.map((p) => {
          const img = p.images[0];
          const src = img?.url;
          return (
            <div key={p.id} className={`${styles.card} glass-soft lift`}>
              <Link href={`/admin/properties/${p.id}/edit`} className={styles.media}>
                {src ? (
                  <Image src={src} alt={p.title} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                ) : (
                  <div className={styles.placeholder} />
                )}
                <div className={styles.overlay} />
                <div className={styles.mediaText}>
                  <div className={styles.mediaTitle}>{p.title}</div>
                  <div className={styles.mediaMeta}>
                    {p.location} • {p.type}
                  </div>
                </div>
              </Link>

              <div className={styles.cardBottom}>
                <div className={styles.price}>{new Intl.NumberFormat("tr-TR").format(p.price)} TL</div>
                <div className={styles.cardActions}>
                  <Link className={`${styles.smallLink} lift focus-ring`} href={`/admin/properties/${p.id}/edit`}>
                    Düzenle
                  </Link>
                  <DeletePropertyButton id={p.id} className={styles.dangerBtn} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

