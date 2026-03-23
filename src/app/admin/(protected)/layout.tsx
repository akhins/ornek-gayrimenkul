import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }
  return <>{children}</>;
}

