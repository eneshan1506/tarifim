"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import { categories, recipes } from "@/data/mockData";

const sortOptions = [
  { value: "populer", label: "En Popüler" },
  { value: "yeni",    label: "En Yeni" },
  { value: "hizli",  label: "En Hızlı" },
  { value: "begeni", label: "En Çok Beğenilen" },
];

const difficultyFilters = ["Tümü", "Kolay", "Orta", "Zor"];

export default function TariflerClient() {
  const searchParams   = useSearchParams();
  const initialKat     = searchParams.get("kategori") || "tumu";
  const initialTip     = searchParams.get("tip")      || "";
  const initialSearch  = searchParams.get("q")        || "";

  const [activeCategory,    setActiveCategory]   = useState(initialKat);
  const [activeDifficulty,  setActiveDifficulty] = useState(initialTip === "hizli" ? "Kolay" : "Tümü");
  const [sortBy,            setSortBy]           = useState(initialTip === "hizli" ? "hizli" : "populer");
  const [search,            setSearch]           = useState(initialSearch);
  const [likedCards,        setLikedCards]       = useState(new Set());
  const [savedCards,        setSavedCards]       = useState(new Set());

  const toggleLike = (id) => setLikedCards((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSave = (id) => setSavedCards((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filtered = useMemo(() => {
    let result = [...recipes];
    if (activeCategory  !== "tumu") result = result.filter((r) => r.category  === activeCategory);
    if (activeDifficulty !== "Tümü") result = result.filter((r) => r.difficulty === activeDifficulty);
    if (search) result = result.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase()));
    if      (sortBy === "hizli")  result.sort((a, b) => a.time - b.time);
    else if (sortBy === "begeni") result.sort((a, b) => b.likes - a.likes);
    else if (sortBy === "yeni")   result.sort((a, b) => b.id - a.id);
    else result.sort((a, b) => (b.likes + b.comments * 3) - (a.likes + a.comments * 3));
    return result;
  }, [activeCategory, activeDifficulty, sortBy, search]);

  return (
    <SiteLayout>
      {/* Başlık */}
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">Tarifler</h1>
        <p className="mt-2 text-[#7f6248]">Toplam <strong>{filtered.length}</strong> tarif bulundu</p>
      </section>

      {/* Filtre bar */}
      <section className="mb-6 rounded-2xl border border-[#f1dac3] bg-white p-4 shadow-sm animate-fade-in-up delay-1">
        {/* Arama */}
        <div className="search-box mb-4 flex items-center gap-2 rounded-full border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5">
          <svg className="h-5 w-5 shrink-0 text-[#c84f03]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Tarif adı veya içerik ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
            aria-label="Tarif ara"
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0 text-[#b89a7c] hover:text-[#c84f03] text-xs" aria-label="Aramayı temizle">✕</button>
          )}
        </div>

        {/* Kategori pills */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("tumu")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84f03] ${activeCategory === "tumu" ? "bg-[#c84f03] text-white shadow" : "bg-[#fff5eb] text-[#7f6248] hover:bg-[#ffe8cc]"}`}
          >
            🍽️ Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84f03] ${activeCategory === cat.slug ? "bg-[#c84f03] text-white shadow" : "bg-[#fff5eb] text-[#7f6248] hover:bg-[#ffe8cc]"}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Alt filtreler */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#7f6248]">Zorluk:</span>
            {difficultyFilters.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84f03] ${activeDifficulty === d ? "bg-[#2f2318] text-white" : "text-[#7f6248] hover:bg-[#fff5eb]"}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-[#7f6248]">Sırala:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#f1dac3] bg-[#fffdf8] px-3 py-1 text-xs font-semibold text-[#5f3d25] outline-none focus:border-[#c84f03]"
            >
              {sortOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
        </div>
      </section>

      {/* Tarif kartları grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((recipe, i) => (
          <article
            key={recipe.id}
            className="recipe-card group overflow-hidden rounded-2xl border border-[#f1dac3] bg-white shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Görsel — Next.js Image */}
            <Link href={`/tarifler/${recipe.slug}`} className="block">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5]">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="recipe-image object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badges */}
                <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white z-10" style={{ background: recipe.dColor }}>
                  {recipe.difficulty}
                </span>
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#2f2318] backdrop-blur z-10">
                  ⏰ {recipe.time} dk
                </span>

                {/* Alt bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-10">
                  <span className="text-xs text-white/90 font-medium">❤️ {recipe.likes} &nbsp; 💬 {recipe.comments}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSave(recipe.id); }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur text-white hover:bg-black/50 transition-colors"
                    aria-label={savedCards.has(recipe.id) ? "Favoriden kaldır" : "Favoriye ekle"}
                  >
                    {savedCards.has(recipe.id) ? "🔖" : "🏷️"}
                  </button>
                </div>
              </div>
            </Link>

            {/* Kart içeriği */}
            <div className="p-4">
              <Link href={`/tarifler/${recipe.slug}`}>
                <h3 className="font-semibold text-[#2f2318] group-hover:text-[#c84f03] transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
              </Link>
              <p className="mt-1 text-xs text-[#7f6248] line-clamp-2">{recipe.desc}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: recipe.aColor }}>
                    {recipe.author[0]}
                  </div>
                  <span className="text-xs text-[#7f6248]">{recipe.author}</span>
                </div>
                <button
                  onClick={() => toggleLike(recipe.id)}
                  className="heart-btn flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c84f03]"
                  style={{ color: likedCards.has(recipe.id) ? "#ef4444" : "#b89a7c" }}
                  aria-label={likedCards.has(recipe.id) ? "Beğeniyi geri al" : "Beğen"}
                  aria-pressed={likedCards.has(recipe.id)}
                >
                  {likedCards.has(recipe.id) ? "❤️" : "🤍"} {recipe.likes + (likedCards.has(recipe.id) ? 1 : 0)}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-6xl mb-4">🍽️</p>
          <p className="text-lg text-[#7f6248]">Aramanızla eşleşen tarif bulunamadı.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("tumu"); setActiveDifficulty("Tümü"); }}
            className="mt-4 rounded-full bg-[#c84f03] px-6 py-2 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </SiteLayout>
  );
}
