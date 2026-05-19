"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
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

export default function FavorilerClient({ favorites }) {
  const [removedIds, setRemovedIds] = useState(new Set());
  const [isPending, startTransition] = useTransition();
  const visible = favorites.filter((recipe) => !removedIds.has(recipe.id));

  const handleRemove = (recipeId) => {
    startTransition(async () => {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setRemovedIds((prev) => new Set(prev).add(recipeId));
    });
  };

  return (
    <SiteLayout>
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">❤️ Favorilerim</h1>
        <p className="mt-2 text-[#7f6248]">
          Favoriye eklediginiz <strong>{visible.length}</strong> tarif
        </p>
      </section>

      {visible.length === 0 ? (
        <div className="mt-12 text-center animate-fade-in">
          <p className="mb-4 text-7xl">🔖</p>
          <p className="mb-4 text-lg text-[#7f6248]">Henüz favorilere eklediğiniz tarif yok.</p>
          <Link
            href="/tarifler"
            className="rounded-full bg-[#c84f03] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a03d02]"
          >
            Tarifleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((recipe, index) => (
            <article
              key={recipe.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70 transition-all hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(126,74,38,0.12)] animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Link href={`/tarifler/${recipe.slug}`} className="block">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5]">
                  <Image
                    src={recipe.image || "/file.svg"}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="recipe-image object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      handleRemove(recipe.id);
                    }}
                    disabled={isPending}
                    className="absolute right-2 top-2 z-10 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-red-500 backdrop-blur transition-colors hover:bg-red-50 disabled:opacity-50"
                    aria-label={`${recipe.title} favoriden kaldır`}
                  >
                    ✕ Kaldır
                  </button>

                  <span
                    className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: getDifficultyColor(recipe.difficulty) }}
                  >
                    {recipe.difficulty}
                  </span>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/tarifler/${recipe.slug}`}>
                  <h3 className="font-semibold text-[#2f2318] transition-colors group-hover:text-[#c84f03]">
                    {recipe.title}
                  </h3>
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-[#7f6248]">{recipe.desc}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#7f6248]">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: recipe.aColor }}
                    >
                      {recipe.author[0]}
                    </div>
                    <span>{recipe.author}</span>
                  </div>
                  <span className="text-[#b89a7c]">❤️ {recipe.likes} · ⏰ {recipe.time} dk</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </SiteLayout>
  );
}
