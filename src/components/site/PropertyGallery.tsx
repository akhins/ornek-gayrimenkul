"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./PropertyGallery.module.css";

type GalleryImage = {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
};

export function PropertyGallery({ images }: { images: GalleryImage[] }) {
  const ordered = useMemo(
    () => images.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const active = ordered[activeIndex] ?? ordered[0];

  return (
    <section className={styles.wrap} aria-label="Görsel Galeri">
      <div className={styles.main}>
        {active?.url ? (
          <div className={styles.mainMedia}>
            <Image
              src={active.url}
              alt={active.altText ?? "Özellik görseli"}
              fill
              sizes="(max-width: 900px) 100vw, 70vw"
              priority
              style={{ objectFit: "cover" }}
            />
            <div className={styles.mainOverlay} />
          </div>
        ) : (
          <div className={styles.mainPlaceholder} />
        )}
      </div>

      {ordered.length > 1 ? (
        <div className={styles.thumbs}>
          {ordered.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              className={styles.thumbBtn}
              data-active={idx === activeIndex ? "true" : "false"}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Görsel ${idx + 1}`}
            >
              <span className={styles.thumbMedia}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.altText ?? "Görsel"} />
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

