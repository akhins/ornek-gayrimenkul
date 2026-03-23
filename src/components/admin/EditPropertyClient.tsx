"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";

export function EditPropertyClient({
  id,
  initial,
}: {
  id: string;
  initial: {
    title: string;
    description: string;
    price: number;
    location: string;
    type: "APARTMENT" | "VILLA" | "PENTHOUSE" | "DUPLEX" | "LAND";
    features: string[];
    images?: { id: string; url: string; altText?: string | null; sortOrder: number }[];
  };
}) {
  const router = useRouter();

  return (
    <PropertyForm
      mode="edit"
      submitLabel="Güncelle"
      apiUrl={`/api/admin/properties/${id}`}
      method="PUT"
      initial={initial}
      onSubmitSuccess={() => {
        router.push("/admin/properties");
        router.refresh();
      }}
    />
  );
}

