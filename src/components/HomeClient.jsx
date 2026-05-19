"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";

const SearchIcon = () => (
  <svg className="h-5 w-5 text-[#9c7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const HeartIcon = ({ filled, stroke = "white" }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : stroke} strokeWidth={2}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CommentIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" strokeLinecap="round" />
  </svg>
);

function getDifficultyColor(label) {
  if (label === "Zor") {
    return "#ef4444";
  }

  if (label === "Orta") {
    return "#f59e0b";
  }

  return "#22c55e";
}

export default function HomeClient({ categories, sections, initialSavedRecipeIds }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCards, setSavedCards] = useState(new Set(initialSavedRecipeIds));
  const [isSaving, startSavingTransition] = useTransition();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tarifler?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleSave = (id) => {
    const wasSaved = savedCards.has(id);

    setSavedCards((prev) => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });

    startSavingTransition(async () => {
      const response = await fetch(`/api/favorites/${id}`, {
        method: wasSaved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        setSavedCards((prev) => {
          const next = new Set(prev);
          wasSaved ? next.add(id) : next.delete(id);
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff8ef] via-[#ffe8cc] to-[#ffd6a5] p-6 shadow-[0_24px_60px_rgba(126,74,38,0.16)] sm:p-10 md:p-14">
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#c84f03] opacity-[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-[#e8930f] opacity-[0.08] blur-3xl" />
        <div className="pointer-events-none absolute right-[15%] top-[10%] hidden text-5xl opacity-80 animate-float md:block" aria-hidden="true">🍕</div>
        <div className="pointer-events-none absolute left-[8%] top-[60%] hidden text-4xl opacity-70 animate-float delay-3 md:block" aria-hidden="true">🥘</div>
        <div className="pointer-events-none absolute right-[30%] bottom-[5%] hidden text-4xl opacity-60 animate-float delay-5 md:block" aria-hidden="true">🍰</div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="animate-fade-in-up font-[var(--font-display)] text-4xl font-extrabold leading-tight text-[#3d1e00] sm:text-5xl md:text-6xl">
            Binlerce Tarif,{" "}
            <span className="bg-gradient-to-r from-[#c84f03] to-[#e8930f] bg-clip-text text-transparent">
              Sonsuz Lezzet
            </span>
          </h1>
          <p className="animate-fade-in-up delay-1 mt-4 text-base text-[#6f5440] sm:text-lg">
            T&#252;rkiye&#39;nin en sevilen tarif platformunda yeni lezzetler keşfet, kendi tariflerini paylaş!
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-in-up delay-2 search-box mx-auto mt-8 flex items-center gap-3 rounded-full bg-white/82 px-5 py-3 shadow-[0_10px_26px_rgba(126,74,38,0.10)] ring-1 ring-white/70 backdrop-blur-sm sm:max-w-lg"
          >
            <SearchIcon />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tarif ara... örn: mercimek çorbası"
              className="w-full bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
              aria-label="Tarif ara"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-[#c84f03] to-[#e8930f] px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Ara
            </button>
          </form>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/tarifler?kategori=${category.slug}`}
              className={`category-pill animate-fade-in-up delay-${index + 1} flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-[#3d1e00] shadow-[0_8px_20px_rgba(126,74,38,0.08)] backdrop-blur-sm sm:px-4`}
              style={{ backgroundColor: category.color }}
            >
              <span className="text-lg">{category.emoji}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          className="animate-fade-in rounded-2xl bg-gradient-to-b from-white to-[#fffdf8] p-4 shadow-[0_14px_32px_rgba(126,74,38,0.10)] ring-1 ring-[#f7ecdf]/60 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="section-title font-[var(--font-display)] text-2xl font-bold text-[#2f2318]">
                {section.title}
              </h2>
            </div>
            <Link
              className="group flex items-center gap-1 rounded-full bg-gradient-to-r from-[#c84f03] to-[#e8930f] px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
              href={section.href}
            >
              Tümünü Gör
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div
            className="hide-scrollbar grid grid-flow-col auto-cols-[calc((100%-2.25rem)/4)] gap-3 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] max-lg:auto-cols-[calc((100%-0.75rem)/2)] max-sm:auto-cols-[85%]"
            role="region"
            aria-label={section.title}
          >
            {section.cards.map((card) => {
              const isSaved = savedCards.has(card.id);
              return (
                <article
                  key={card.id}
                  className="recipe-card overflow-hidden rounded-xl bg-white shadow-[0_8px_22px_rgba(126,74,38,0.08)] [scroll-snap-align:start]"
                >
                  <div className="relative h-[180px] overflow-hidden max-sm:h-[200px]">
                    <Image
                      className="recipe-image object-cover"
                      src={card.image || "/file.svg"}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span
                      className="absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
                    >
                      {card.difficulty}
                    </span>

                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#5f3d25] shadow-sm backdrop-blur-sm">
                      <ClockIcon />
                      {card.time} dk
                    </span>

                    <button
                      onClick={() => toggleSave(card.id)}
                      disabled={isSaving}
                      className="heart-btn absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm disabled:opacity-60"
                      aria-label={isSaved ? "Favoriden kaldır" : "Favoriye ekle"}
                    >
                      <HeartIcon filled={isSaved} />
                    </button>

                    <div className="absolute bottom-2 left-2 flex items-center gap-2.5 text-[11px] font-semibold text-white">
                      <span className="flex items-center gap-1">
                        <HeartIcon filled={false} />
                        {card.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <CommentIcon />
                        {card.comments}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 p-3">
                    <Link href={`/tarifler/${card.slug}`}>
                      <h3 className="font-[var(--font-display)] text-lg font-bold leading-tight text-[#2f2318]">
                        {card.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: card.aColor }}
                        >
                          {card.author.charAt(0)}
                        </span>
                        <span className="text-xs text-[#7f6248]">{card.author}</span>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-[#fff5eb] px-2.5 py-1 text-xs font-semibold text-[#7f6248]">
                        <HeartIcon filled={isSaved} stroke="#b89a7c" />
                        <span>{card.likes} favori</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </SiteLayout>
  );
}
