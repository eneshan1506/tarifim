import YeniEklenenlerClient from "./YeniEklenenlerClient";
import { getCurrentUser } from "@/lib/auth/server";
import { getFavoriteRecipeIds, getNewestRecipeCards } from "@/lib/content";

export const metadata = { title: "Yeni Eklenenler — Tarifim", description: "Son eklenen tarifleri keşfedin." };

export default async function YeniEklenenlerPage() {
  const user = await getCurrentUser();
  const [recipes, favoriteRecipeIds] = await Promise.all([
    getNewestRecipeCards(),
    user ? getFavoriteRecipeIds(user.id) : Promise.resolve([]),
  ]);

  return <YeniEklenenlerClient recipes={recipes} initialSavedRecipeIds={favoriteRecipeIds} />;
}
