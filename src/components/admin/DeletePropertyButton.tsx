"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePropertyButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = window.confirm("Bu ilanı silmek istediğinize emin misiniz?");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? "Silme başarısız");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className={className} onClick={onDelete} disabled={loading}>
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}

