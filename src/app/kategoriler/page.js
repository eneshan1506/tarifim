import KategorilerClient from "./KategorilerClient";
import { getCategoryCards } from "@/lib/content";

export const metadata = {
  title: "Kategoriler — Tarifim",
  description: "Tüm yemek kategorilerini keşfedin. Ana yemek, çorba, tatlı, salata ve daha fazlası.",
};

export default async function KategorilerPage() {
  const categories = await getCategoryCards();

  return <KategorilerClient categories={categories} />;
}
