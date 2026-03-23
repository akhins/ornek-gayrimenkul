import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";

export default async function AdminIndexPage() {
  try {
    await requireAdminSession();
    redirect("/admin/properties");
  } catch {
    redirect("/admin/login");
  }
}

