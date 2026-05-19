import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getCategoryCards, getRecipeEditData } from "@/lib/content";
import TarifFormClient from "@/components/TarifFormClient";

export const metadata = {
  title: "Tarif Düzenle — Tarifim",
  description: "Tarifinizi güncelleyin.",
};

export default async function TarifDuzenlePage({ params }) {
  const user = await requireUser();
  const { slug } = await params;
  const [categories, recipe] = await Promise.all([
    getCategoryCards(),
    getRecipeEditData(slug, user.id),
  ]);

  if (!recipe) {
    notFound();
  }

  return <TarifFormClient mode="edit" categories={categories} initialForm={recipe} recipeId={recipe.id} />;
}
