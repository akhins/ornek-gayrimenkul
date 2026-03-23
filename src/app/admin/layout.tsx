import type { ReactNode } from "react";
import styles from "./adminLayout.module.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}

