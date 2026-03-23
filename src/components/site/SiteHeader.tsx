"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SiteHeader.module.css";

type Theme = "dark" | "light";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "Gayrimenkuller" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
] as const;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("og_theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
}

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("og_theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    if (pathname.startsWith("/properties")) return "/properties";
    return pathname;
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />

      <motion.header
        className={styles.header}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        data-scrolled={scrolled ? "true" : "false"}
      >
        <div className={styles.inner}>
          <Link className={styles.brand} href="/">
            <Image src="/logo.png" alt="Logo" width={28} height={28} style={{ borderRadius: 6 }} priority />
            <span className={styles.brandText}>Örnek Gayrimenkul Alanya</span>
          </Link>

          <nav className={styles.nav} aria-label="Site gezinme">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                data-active={activeHref === item.href ? "true" : "false"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.iconBtn} lift focus-ring`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Tema değiştir"
            >
              <span className={styles.icon} aria-hidden="true">
                {theme === "dark" ? "◐" : "◑"}
              </span>
            </button>

            <Link className={`${styles.cta} lift focus-ring`} href="/contact">
              Teklif Al
            </Link>

            <button
              type="button"
              className={`${styles.iconBtn} ${styles.burger} lift focus-ring`}
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <span className={styles.icon} aria-hidden="true">
                ☰
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.mobilePanel}>
              <div className={styles.mobileTop}>
                <Link className={styles.brandMobile} href="/" onClick={() => setMenuOpen(false)}>
                  <Image src="/logo.png" alt="Logo" width={24} height={24} style={{ borderRadius: 4 }} />
                  Örnek Gayrimenkul Alanya
                </Link>

                <button
                  type="button"
                  className={`${styles.iconBtn} lift focus-ring`}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menüyü kapat"
                >
                  <span className={styles.icon} aria-hidden="true">
                    ✕
                  </span>
                </button>
              </div>

              <div className={styles.mobileLinks}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    className={styles.mobileLink}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.mobileArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className={styles.mobileBottom}>
                <button
                  type="button"
                  className={`${styles.themeBtn} lift focus-ring`}
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                >
                  Tema: {theme === "dark" ? "Koyu" : "Açık"}
                </button>
                <Link
                  className={`${styles.ctaMobile} lift focus-ring`}
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Teklif Al
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

