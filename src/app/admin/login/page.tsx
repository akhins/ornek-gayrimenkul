"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./adminLogin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Giriş başarısız");
        return;
      }
      router.push("/admin/properties");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} glass`}>
        <div className={styles.top}>
          <div className={styles.kicker}>Admin Panel</div>
          <h1 className={styles.title}>Güvenli Giriş</h1>
          <div className={styles.desc}>Özellik ekleyin, düzenleyin ve galerileri yönetin.</div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            E-posta
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.label}>
            Şifre
            <input
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className={styles.error}>{error}</div> : null}

          <button className={styles.btn} disabled={loading} type="submit">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

      </div>
    </div>
  );
}

