"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <div className={styles.brand}>Örnek Gayrimenkul Alanya</div>
          <div className={styles.sub}>Alanya&apos;nın premium gayrimenkul deneyimi.</div>
        </div>

        <div className={styles.col}>
          <div className={styles.title}>Sayfalar</div>
          <Link className={styles.link} href="/properties">
            Gayrimenkuller
          </Link>
          <Link className={styles.link} href="/about">
            Hakkımızda
          </Link>
          <Link className={styles.link} href="/contact">
            İletişim
          </Link>
        </div>

        <div className={styles.col}>
          <div className={styles.title}>İletişim</div>
          <div className={styles.meta}>info@ornekgayrimenkul.com</div>
          <div className={styles.meta}>0532 795 69 33</div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div>© {new Date().getFullYear()} Örnek Gayrimenkul Alanya. Tüm hakları saklıdır.</div>
        <Link className={styles.bottomLink} href="/contact">
          Teklif Al
        </Link>
      </div>
    </footer>
  );
}

