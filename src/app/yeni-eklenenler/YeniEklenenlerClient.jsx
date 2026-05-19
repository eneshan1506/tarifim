"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";

function getDifficultyColor(label) {
  if (label === "Zor") {
    return "#ef4444";
  }

  if (label === "Orta") {
    return "#f59e0b";
  }

  return "#22c55e";
}

export default function YeniEklenenlerClient({ recipes, initialSavedRecipeIds }) {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState(new Set(initialSavedRecipeIds));
  const [isSaving, startSavingTransition] = useTransition();

  const toggleSave = (recipeId) => {
    const wasSaved = savedCards.has(recipeId);

    setSavedCards((prev) => {
      const next = new Set(prev);
      wasSaved ? next.delete(recipeId) : next.add(recipeId);
      return next;
    });

    startSavingTransition(async () => {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: wasSaved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        setSavedCards((prev) => {
          const next = new Set(prev);
          wasSaved ? next.add(recipeId) : next.delete(recipeId);
          return next;
        });

        if (response.status === 401) {
          router.push("/giris");
        }
      }
    });
  };

  return (
    <SiteLayout>
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">🆕 Yeni Eklenenler</h1>
        <p className="mt-2 text-[#7f6248]">Son eklenen <strong>{recipes.length}</strong> tarif</p>
      </section>

      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <Link
            key={recipe.id}
            href={`/tarifler/${recipe.slug}`}
            className="group flex gap-4 rounded-2xl bg-white p-3 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70 transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={recipe.image || "/file.svg"}
                alt={recipe.title}
                fill
                sizes="96px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1 py-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-[#fff5eb] px-2 py-0.5 text-[10px] font-semibold text-[#c84f03]">
                  {recipe.categoryEmoji} {recipe.categoryLabel}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: getDifficultyColor(recipe.difficulty) }}
                >
                  {recipe.difficulty}
                </span>
              </div>
              <h3 className="truncate font-semibold text-[#2f2318] transition-colors group-hover:text-[#c84f03]">
                {recipe.title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-xs text-[#7f6248]">{recipe.desc}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-[#b89a7c]">
                <span>👤 {recipe.author}</span>
                <span>⏰ {recipe.time} dk</span>
                <span>❤️ {recipe.likes}</span>
                <span>💬 {recipe.comments}</span>
              </div>
            </div>

            <button
              onClick={(event) => {
                event.preventDefault();
                toggleSave(recipe.id);
              }}
              disabled={isSaving}
              className="self-start rounded-full bg-[#fff5eb] px-3 py-1.5 text-xs font-semibold text-[#c84f03] disabled:opacity-60"
            >
              {savedCards.has(recipe.id) ? "Favoride" : "Favori"}
            </button>
          </Link>
        ))}
      </div>
    </SiteLayout>
  );
}
