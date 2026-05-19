import { Suspense } from "react";
import TariflerClient from "./TariflerClient";
import { getCategoryCards, getFavoriteRecipeIds, getRecipeCards } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata = {
  title: "Tarifler — Tarifim",
  description: "Tüm tarifleri keşfedin. Filtreleme, sıralama ve kategoriye göre arama yapın.",
};

export default async function TariflerPage() {
  const user = await getCurrentUser();
  const [categories, recipes, favoriteRecipeIds] = await Promise.all([
    getCategoryCards(),
    getRecipeCards(),
    user ? getFavoriteRecipeIds(user.id) : Promise.resolve([]),
  ]);

  return (
    <Suspense>
      <TariflerClient categories={categories} recipes={recipes} initialSavedRecipeIds={favoriteRecipeIds} />
    </Suspense>
  );
}
