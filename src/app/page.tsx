import Link from "next/link";
import { listPublicProperties } from "@/lib/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import styles from "./home.module.css";

export default async function Home() {
  const featured = await listPublicProperties();

  const heroPoster =
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=2400&q=80";
  const heroVideo = "/videos/hero-video.mp4";

  const categories: Array<{ type: string; label: string; desc: string }> = [
    { type: "APARTMENT", label: "Daireler", desc: "Şehir içi premium yaşam alanları." },
    { type: "VILLA", label: "Villalar", desc: "Gizlilik, konfor ve modern mimari." },
    { type: "PENTHOUSE", label: "Penthouse", desc: "Işıkla tasarlanmış teras hayatı." },
    { type: "DUPLEX", label: "Duplex", desc: "Farklı kat planlarıyla ayrıcalık." },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroKicker}>Luxury Real Estate</div>
          <h1 className={styles.heroTitle}>
            Örnek Gayrimenkul Alanya ile
            <span className={styles.heroAccent}> modern</span> yaşamın zirvesi
          </h1>
          <p className={styles.heroDesc}>
            Alanya'nın en seçkin portföylerini keşfedin. Lüks, konfor ve güvenin buluşma noktası.
          </p>

          <div className={styles.heroActions}>
            <Link className={`${styles.primaryBtn} lift focus-ring`} href="/properties">
              İlanları Keşfet
            </Link>
            <Link className={`${styles.secondaryBtn} lift focus-ring`} href="/contact">
              Kişisel Teklif Al
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{featured.length || 3}</div>
              <div className={styles.statLabel}>Öne çıkan ilan</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>4+</div>
              <div className={styles.statLabel}>Kategoriler</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>24/7</div>
              <div className={styles.statLabel}>Güncelleme</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.kicker}>Featured</div>
            <h2 className={styles.sectionTitle}>Öne Çıkanlar</h2>
          </div>
          <div className={styles.sectionHint}>
            Kartlar üzerinde hover ile detay katmanı • görsellerde yumuşak zoom • premium his.
          </div>
        </div>

        <div className={styles.carousel} aria-label="Öne çıkan ilanlar">
          {featured.slice(0, 6).map((p) => (
            <div key={p.id} className={styles.carouselItem}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>

        <div className={styles.moreRow}>
          <Link className={`${styles.moreBtn} lift focus-ring`} href="/properties">
            Tüm İlanları Gör
          </Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.categories}`}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.kicker}>Kategoriler</div>
            <h2 className={styles.sectionTitle}>Aradığınız yaşam tarzını seçin</h2>
          </div>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <Link
              key={c.type}
              href={`/properties?type=${encodeURIComponent(c.type)}`}
              className={`${styles.categoryCard} glass-soft lift focus-ring`}
            >
              <div className={styles.catTop}>
                <div className={styles.catLabel}>{c.label}</div>
                <div className={styles.catArrow} aria-hidden="true">
                  →
                </div>
              </div>
              <div className={styles.catDesc}>{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
