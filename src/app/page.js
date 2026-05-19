import HomeClient from "@/components/HomeClient";
import { getCurrentUser } from "@/lib/auth/server";
import { getFavoriteRecipeIds, getHomePageData } from "@/lib/content";

// Ana sayfa route'u: sadece HomeClient bileşenini render eder.
export default async function HomePage() {
  const user = await getCurrentUser();
  const [{ categories, sections }, favoriteRecipeIds] = await Promise.all([
    getHomePageData(),
    user ? getFavoriteRecipeIds(user.id) : Promise.resolve([]),
  ]);

  return <HomeClient categories={categories} sections={sections} initialSavedRecipeIds={favoriteRecipeIds} />;
}
