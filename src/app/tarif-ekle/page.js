import { requireUser } from "@/lib/auth/server";
import { getCategoryCards } from "@/lib/content";
import TarifFormClient from "@/components/TarifFormClient";

export const metadata = {
  title: "Tarif Ekle — Tarifim",
  description: "Kendi tarifinizi paylaşın.",
};

export default async function TarifEklePage() {
  await requireUser();
  const categories = await getCategoryCards();

  return <TarifFormClient mode="create" categories={categories} />;
}
