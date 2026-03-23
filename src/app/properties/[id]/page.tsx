import { notFound } from "next/navigation";
import { getPublicPropertyById } from "@/lib/properties";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { MapEmbed } from "@/components/site/MapEmbed";
import { ContactForm } from "@/components/site/ContactForm";
import styles from "./propertyDetail.module.css";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPublicPropertyById(params.id);
  if (!property) notFound();

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.kicker}>İlan Detayı</div>
          <h1 className={styles.title}>{property.title}</h1>
          <div className={styles.meta}>
            <span>{property.location}</span>
            <span className={styles.dot} aria-hidden="true">
              •
            </span>
            <span>{property.type}</span>
          </div>
          <div className={styles.price}>
            {new Intl.NumberFormat("tr-TR").format(property.price)} <span>TL</span>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <PropertyGallery images={property.images} />

            <div className={`${styles.panel} glass-soft`}>
              <div className={styles.panelTitle}>Açıklama</div>
              <div className={styles.panelText}>{property.description}</div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={`${styles.panel} glass-soft`}>
              <div className={styles.panelTitle}>Öne Çıkan Özellikler</div>
              <div className={styles.chips}>
                {property.features.length ? (
                  property.features.map((f) => (
                    <div key={f} className={styles.chip}>
                      {f}
                    </div>
                  ))
                ) : (
                  <div className={styles.muted}>Bu ilan için özellik eklenmemiş.</div>
                )}
              </div>
            </div>

            <div className={`${styles.panel} glass-soft`}>
              <div className={styles.panelTitle}>Konum</div>
              <div className={styles.muted} style={{ marginBottom: 12 }}>
                {property.location} (demo harita)
              </div>
              <MapEmbed label={property.location} />
            </div>

            <div className={`${styles.panel} glass-soft`}>
              <div className={styles.panelTitle}>İletişime Geç</div>
              <div className={styles.muted} style={{ marginBottom: 12 }}>
                Bu ilan için teklif talep edebilirsiniz.
              </div>
              <ContactForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

