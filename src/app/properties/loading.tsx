import styles from "./propertiesLoading.module.css";

export default function PropertiesLoading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} />
      <div className={styles.content}>
        <div className={styles.layout}>
          <div className={`${styles.block} ${styles.filters}`} />
          <div className={styles.main}>
            <div className={styles.topRow}>
              <div className={styles.sTitle} />
              <div className={styles.sMeta} />
            </div>
            <div className={styles.grid}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={styles.card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

