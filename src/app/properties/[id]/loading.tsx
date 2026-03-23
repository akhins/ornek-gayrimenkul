import styles from "./propertyDetailLoading.module.css";

export default function PropertyDetailLoading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} />
      <div className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.gallery} />
            <div className={styles.panel} />
          </div>
          <div className={styles.right}>
            <div className={styles.panel} />
            <div className={styles.panel} />
            <div className={styles.panel} />
          </div>
        </div>
      </div>
    </div>
  );
}

