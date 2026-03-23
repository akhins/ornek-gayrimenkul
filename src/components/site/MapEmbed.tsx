import styles from "./MapEmbed.module.css";

export function MapEmbed({ label }: { label?: string }) {
  // Alanya lokasyonu
  const src =
    "https://www.openstreetmap.org/export/embed.html?bbox=31.9600%2C36.5300%2C32.0200%2C36.5600&layer=mapnik&marker=36.5438%2C31.9998";

  return (
    <div className={styles.wrap} aria-label="Harita">
      <iframe
        className={styles.iframe}
        loading="lazy"
        src={src}
        title={label ?? "Konum haritası"}
      />
    </div>
  );
}

