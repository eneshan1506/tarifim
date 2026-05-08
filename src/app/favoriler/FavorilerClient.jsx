"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { recipes, categories } from "@/data/mockData";

export default function FavorilerClient() {
  const favorited = recipes.slice(0, 6);
  const [removedIds, setRemovedIds] = useState(new Set());

  const visible = favorited.filter((r) => !removedIds.has(r.id));

  return (
    <SiteLayout>
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">❤️ Favorilerim</h1>
        <p className="mt-2 text-[#7f6248]">
          Kaydettiğiniz <strong>{visible.length}</strong> tarif
        </p>
      </section>

      {visible.length === 0 ? (
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-7xl mb-4">🔖</p>
          <p className="text-lg text-[#7f6248] mb-4">Henüz favorilere eklediğiniz tarif yok.</p>
          <Link
            href="/tarifler"
            className="rounded-full bg-[#c84f03] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors"
          >
            Tarifleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r, i) => {
            const cat = categories.find((c) => c.slug === r.category);
            return (
              <article
                key={r.id}
                className="group relative overflow-hidden rounded-2xl border border-[#f1dac3] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Görsel */}
                <Link href={`/tarifler/${r.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5]">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="recipe-image object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Kaldır butonu */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setRemovedIds((prev) => new Set(prev).add(r.id));
                      }}
                      className="absolute top-2 right-2 z-10 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`${r.title} favoriden kaldır`}
                    >
                      ✕ Kaldır
                    </button>

                    <span
                      className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: r.dColor }}
                    >
                      {r.difficulty}
                    </span>
                  </div>
                </Link>

                {/* Kart içeriği */}
                <div className="p-4">
                  <Link href={`/tarifler/${r.slug}`}>
                    <h3 className="font-semibold text-[#2f2318] group-hover:text-[#c84f03] transition-colors">
                      {r.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-[#7f6248] line-clamp-2">{r.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#7f6248]">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: r.aColor }}
                      >
                        {r.author[0]}
                      </div>
                      <span>{r.author}</span>
                    </div>
                    <span className="text-[#b89a7c]">❤️ {r.likes} · ⏰ {r.time} dk</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SiteLayout>
  );
}
