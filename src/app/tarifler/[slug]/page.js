import { recipes } from "@/data/mockData";
import TarifDetayClient from "./TarifDetayClient";

export async function generateMetadata({ params }) {
  const recipe = recipes.find((r) => r.slug === params.slug);
  return {
    title: recipe ? `${recipe.title} — Tarifim` : "Tarif Bulunamadı — Tarifim",
    description: recipe?.desc ?? "Tarif detayları, malzemeler ve yapılış adımları.",
    openGraph: recipe
      ? {
          title: `${recipe.title} — Tarifim`,
          description: recipe.desc,
          images: [{ url: recipe.image, width: 800, height: 600, alt: recipe.title }],
        }
      : undefined,
  };
}

export default function TarifDetayPage({ params }) {
  return <TarifDetayClient slug={params.slug} />;
}
