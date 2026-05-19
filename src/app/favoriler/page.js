import FavorilerClient from "./FavorilerClient";
import { requireUser } from "@/lib/auth/server";
import { getFavoriteRecipeCards } from "@/lib/content";

export const metadata = { title: "Favorilerim — Tarifim", description: "Favoriye eklediginiz tarifleri goruntuleyin." };

export default async function FavorilerPage() {
  const user = await requireUser();
  const favorites = await getFavoriteRecipeCards(user.id);

  return <FavorilerClient favorites={favorites} />;
}
