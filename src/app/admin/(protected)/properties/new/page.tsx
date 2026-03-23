"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import styles from "../adminPropertyEditorPage.module.css";

export default function AdminPropertyNewPage() {
  const router = useRouter();

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <div className={styles.kicker}>Yeni İlan</div>
          <h1 className={styles.title}>Premium Galeri Yaratın</h1>
          <div className={styles.sub}>Web sitede anında görüntülenecek şekilde bir ilan oluşturun.</div>
        </div>

        <Link className={`${styles.back} lift focus-ring`} href="/admin/properties">
          ← İlanlara Dön
        </Link>
      </div>

      <div className={`${styles.card} glass-soft`}>
        <PropertyForm
          mode="create"
          submitLabel="İlanı Oluştur"
          apiUrl="/api/admin/properties"
          method="POST"
          onSubmitSuccess={() => {
            router.push("/admin/properties");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}

