import Image from "next/image";
import styles from "./about.module.css";

export default function AboutPage() {
  const bg =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <Image src={bg} alt="Marka hikayesi" fill priority style={{ objectFit: "cover" }} />
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <div className={styles.kicker}>Hakkımızda</div>
          <h1 className={styles.title}>Özenle tasarlanmış bir yaşam deneyimi.</h1>
          <p className={styles.desc}>
            Örnek Gayrimenkul Alanya; bölgenin seçkin mimarisini, lüks hizmet yaklaşımıyla birleştirir. Amacımız sadece bir mülk göstermek değil, yaşam tarzınızı yansıtacak en doğru gayrimenkulü sizinle buluşturmaktır.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={`${styles.card} glass-soft`}>
            <div className={styles.cardTitle}>Tasarım İlkesi</div>
            <div className={styles.cardText}>
              Minimal arayüz, güçlü görsel hiyerarşi ve mikro etkileşimlerle lüks hissini görünür kılıyoruz.
            </div>
          </div>
          <div className={`${styles.card} glass-soft`}>
            <div className={styles.cardTitle}>Geniş Portföy</div>
            <div className={styles.cardText}>
              Alanya&apos;nın en değerli lokasyonlarında, standartlarınıza uygun premium seçenekler sunarız.
            </div>
          </div>
          <div className={`${styles.card} glass-soft`}>
            <div className={styles.cardTitle}>Şeffaf Süreç</div>
            <div className={styles.cardText}>
              Karar sürecinden tapu devrine kadar her aşamada güven ve şeffaflıkla hareket ederiz.
            </div>
          </div>
          <div className={`${styles.card} glass-soft`}>
            <div className={styles.cardTitle}>Kesintisiz İletişim</div>
            <div className={styles.cardText}>
              Tüm süreç boyunca açık iletişim ve profesyonel uzmanlığımızla sizin yanınızdayız.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

