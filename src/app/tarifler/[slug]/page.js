import TarifDetayClient from "./TarifDetayClient";
import { getFavoriteRecipeIds, getRecipeDetail } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/server";

async function resolveSlug(params) {
  const resolvedParams = await params;
  return resolvedParams?.slug ?? null;
}

export async function generateMetadata({ params }) {
  const slug = await resolveSlug(params);
  const detail = await getRecipeDetail(slug);
  const recipe = detail?.recipe;
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

export default async function TarifDetayPage({ params }) {
  const user = await getCurrentUser();
  const slug = await resolveSlug(params);
  const detail = await getRecipeDetail(slug);
  const favoriteRecipeIds = user ? await getFavoriteRecipeIds(user.id) : [];

  return (
    <TarifDetayClient
      detail={detail}
      slug={slug}
      initialSaved={favoriteRecipeIds.includes(detail?.recipe?.id)}
      viewerUserId={user?.id || null}
    />
  );
}
