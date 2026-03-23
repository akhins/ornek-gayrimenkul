import { listPublicProperties } from "@/lib/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import styles from "./properties.module.css";
import Link from "next/link";
import type { PropertyType as PrismaPropertyType } from "@prisma/client";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: {
    type?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
  };
}) {
  const type = searchParams?.type && searchParams.type !== "ALL" ? (searchParams.type as PrismaPropertyType) : "ALL";
  const location = searchParams?.location ?? "";
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const q = searchParams?.q ?? "";

  const properties = await listPublicProperties({
    type,
    location: location || undefined,
    minPrice: typeof minPrice === "number" && Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: typeof maxPrice === "number" && Number.isFinite(maxPrice) ? maxPrice : undefined,
    q: q || undefined,
  });

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.kicker}>Gayrimenkuller</div>
          <h1 className={styles.title}>Aradığınızı bulun.</h1>
          <p className={styles.desc}>
            Premium kart tasarımları, yumuşak hover detayları ve hızlı filtreleme.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.layout}>
          <aside className={styles.filters}>
            <form method="GET" action="/properties" className={styles.form}>
              <div className={styles.filterGroup}>
                <div className={styles.label}>Arama</div>
                <input
                  className={styles.input}
                  name="q"
                  defaultValue={q}
                  placeholder="Başlık veya açıklama..."
                />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.label}>Lokasyon</div>
                <input
                  className={styles.input}
                  name="location"
                  defaultValue={location}
                  placeholder="Örn: İstanbul / Beşiktaş"
                />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.label}>Tür</div>
                <select className={styles.input} name="type" defaultValue={type === "ALL" ? "ALL" : type}>
                  <option value="ALL">Tümü</option>
                  <option value="APARTMENT">Daire</option>
                  <option value="VILLA">Villa</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="DUPLEX">Duplex</option>
                  <option value="LAND">Arsa</option>
                </select>
              </div>

              <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                  <div className={styles.label}>Min Fiyat</div>
                  <input className={styles.input} name="minPrice" defaultValue={minPrice ?? ""} placeholder="-" />
                </div>

                <div className={styles.filterGroup}>
                  <div className={styles.label}>Max Fiyat</div>
                  <input className={styles.input} name="maxPrice" defaultValue={maxPrice ?? ""} placeholder="-" />
                </div>
              </div>

              <button className={`${styles.btn} lift focus-ring`} type="submit">
                Filtrele
              </button>

              <Link className={`${styles.btnGhost} lift focus-ring`} href="/properties">
                Sıfırla
              </Link>
            </form>
          </aside>

          <main className={styles.main}>
            <div className={styles.resultsTop}>
              <div className={styles.resultTitle}>Sonuçlar</div>
              <div className={styles.resultMeta}>{properties.length} ilan</div>
            </div>

            {properties.length === 0 ? (
              <div className={`${styles.empty} glass-soft`}>
                <div className={styles.emptyTitle}>Sonuç bulunamadı.</div>
                <div className={styles.emptySub}>Filtreleri gevşetin veya ana aramaya dönün.</div>
              </div>
            ) : null}

            <div className={styles.grid}>
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

