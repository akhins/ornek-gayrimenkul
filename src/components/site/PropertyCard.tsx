import Image from "next/image";
import Link from "next/link";
import styles from "./PropertyCard.module.css";
import type { PublicProperty } from "@/lib/properties";

export function PropertyCard({ property }: { property: PublicProperty }) {
  const cover = property.images[0];

  return (
    <Link className={`${styles.card} lift focus-ring`} href={`/properties/${property.id}`}>
      <div className={styles.media}>
        {cover ? (
          <Image
            src={cover.url}
            alt={property.title}
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay} />

        <div className={styles.text}>
          <div className={styles.title}>{property.title}</div>
          <div className={styles.meta}>
            {property.location} • {property.type}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.price}>{new Intl.NumberFormat("tr-TR").format(property.price)} TL</div>
        <div className={styles.cta}>Detay</div>
      </div>
    </Link>
  );
}

