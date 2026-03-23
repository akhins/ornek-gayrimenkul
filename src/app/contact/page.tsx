import Image from "next/image";
import { ContactForm } from "@/components/site/ContactForm";
import { MapEmbed } from "@/components/site/MapEmbed";
import styles from "./contact.module.css";

export default function ContactPage() {
  const bg = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <Image src={bg} alt="İletişim" fill priority style={{ objectFit: "cover" }} />
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <div className={styles.kicker}>İletişim</div>
          <h1 className={styles.title}>Konuşalım.</h1>
          <p className={styles.desc}>Teklif taleplerinizi hızlıca iletin. Biz geri dönüş sağlayalım.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={`${styles.panel} glass-soft`}>
            <div className={styles.panelTitle}>Mesaj Formu</div>
            <div className={styles.panelSub}>Online iletişimi minimal, premium ve hızlı tutuyoruz.</div>
            <ContactForm />
          </div>

          <div className={`${styles.panel} glass-soft`}>
            <div className={styles.panelTitle}>İletişim & Konum</div>
            <div className={styles.panelSub}>
              <strong>Kemal Sevindik</strong><br/>
              Saray, Galatasaray Cd., 07400 Alanya / Antalya<br/>
              Telefon: 0532 795 69 33
            </div>
            <MapEmbed />
          </div>
        </div>
      </section>
    </div>
  );
}

