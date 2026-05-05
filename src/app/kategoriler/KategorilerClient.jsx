"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { categories, recipes } from "@/data/mockData";

export default function KategorilerClient() {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SiteLayout>
      {/* Başlık alanı */}
      <section className="mb-8 text-center">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700] sm:text-5xl animate-fade-in-up">
          Kategoriler
        </h1>
        <p className="mt-3 text-[#7f6248] text-lg animate-fade-in-up delay-1">
          İlham almak için bir kategori seçin
        </p>

        {/* Arama */}
        <div className="mt-6 mx-auto max-w-md animate-fade-in-up delay-2">
          <div className="search-box flex items-center gap-2 rounded-full border border-[#f1dac3] bg-white px-4 py-2.5 shadow-sm">
            <svg className="h-5 w-5 text-[#c84f03]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
            />
          </div>
        </div>
      </section>

      {/* Kategori grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((cat, i) => {
          const recipeCount = recipes.filter((r) => r.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/tarifler?kategori=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[#f1dac3] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Dekoratif arka plan blob */}
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150"
                style={{ background: cat.accent }}
              />

              {/* Emoji */}
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ background: cat.color }}
              >
                {cat.emoji}
              </div>

              {/* Bilgiler */}
              <h2 className="text-lg font-bold text-[#2f2318] group-hover:text-[#c84f03] transition-colors">
                {cat.label}
              </h2>
              <p className="mt-1 text-sm text-[#7f6248] line-clamp-2">
                {cat.desc}
              </p>

              {/* Tarif sayısı */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: cat.color, color: cat.accent }}
                >
                  {cat.count} tarif
                </span>
                <span className="text-sm text-[#c84f03] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
                  Keşfet →
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-lg text-[#7f6248]">"{search}" ile eşleşen kategori bulunamadı.</p>
        </div>
      )}
    </SiteLayout>
  );
}
