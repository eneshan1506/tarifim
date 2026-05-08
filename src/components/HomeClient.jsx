"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";

/* ─── Kategori verileri ─── */
const categories = [
  { emoji: "🍖", label: "Ana Yemek", href: "/kategoriler?grup=ana-yemek", bg: "#fee2e2" },
  { emoji: "🥣", label: "Çorba", href: "/kategoriler?grup=corba", bg: "#fef3c7" },
  { emoji: "🥗", label: "Salata", href: "/kategoriler?grup=salata", bg: "#d1fae5" },
  { emoji: "🍰", label: "Tatlı", href: "/kategoriler?grup=tatli", bg: "#fce7f3" },
  { emoji: "🥤", label: "İçecek", href: "/kategoriler?grup=icecek", bg: "#dbeafe" },
  { emoji: "🍳", label: "Kahvaltı", href: "/kategoriler?grup=kahvalti", bg: "#fff7ed" },
  { emoji: "🥪", label: "Atıştırmalık", href: "/kategoriler?grup=atistirmalik", bg: "#f3e8ff" },
  { emoji: "🌱", label: "Vegan", href: "/kategoriler?grup=vegan", bg: "#ecfccb" },
];

/* ─── Tarif bölümleri (mock data) ─── */
const sections = [
  {
    id: "fav",
    title: "Favori Tarifler",
    icon: "❤️",
    href: "/favoriler",
    cards: [
      { id: "f1", name: "Anne Köftesi", time: "40 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 234, comments: 18, author: "Ayşe K.", aColor: "#e879a0", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80" },
      { id: "f2", name: "Mercimek Çorbası", time: "25 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 412, comments: 32, author: "Fatma Y.", aColor: "#60a5fa", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80" },
      { id: "f3", name: "Fırın Makarna", time: "50 dk", difficulty: "Orta", dColor: "#f59e0b", likes: 189, comments: 14, author: "Mehmet A.", aColor: "#a78bfa", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=600&q=80" },
      { id: "f4", name: "Trileçe", time: "60 dk", difficulty: "Orta", dColor: "#f59e0b", likes: 356, comments: 27, author: "Zeynep D.", aColor: "#34d399", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" },
      { id: "f5", name: "Kısır", time: "20 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 178, comments: 9, author: "Elif S.", aColor: "#fb923c", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
      { id: "f6", name: "Revani", time: "40 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 291, comments: 21, author: "Hatice B.", aColor: "#f472b6", image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    id: "new",
    title: "Yeni Eklenenler",
    icon: "🆕",
    href: "/yeni-eklenenler",
    cards: [
      { id: "n1", name: "Sebzeli Noodle", time: "30 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 45, comments: 3, author: "Can T.", aColor: "#60a5fa", image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80" },
      { id: "n2", name: "Tavuk Sote", time: "35 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 78, comments: 6, author: "Derya M.", aColor: "#a78bfa", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80" },
      { id: "n3", name: "Patates Salatası", time: "18 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 33, comments: 2, author: "Selin A.", aColor: "#34d399", image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=80" },
      { id: "n4", name: "Browni Kurabiye", time: "28 dk", difficulty: "Orta", dColor: "#f59e0b", likes: 92, comments: 8, author: "Buse K.", aColor: "#fb923c", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80" },
      { id: "n5", name: "Kıymalı Pide", time: "55 dk", difficulty: "Zor", dColor: "#ef4444", likes: 61, comments: 5, author: "Ali R.", aColor: "#e879a0", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
      { id: "n6", name: "Soğuk Kahve", time: "8 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 120, comments: 11, author: "Deniz Y.", aColor: "#f472b6", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    id: "quick",
    title: "Hızlı Tarifler",
    icon: "⚡",
    href: "/tarifler?tip=hizli",
    cards: [
      { id: "h1", name: "Omlet", time: "10 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 567, comments: 41, author: "Gül N.", aColor: "#60a5fa", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80" },
      { id: "h2", name: "Tost", time: "7 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 321, comments: 19, author: "Cem O.", aColor: "#a78bfa", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80" },
      { id: "h3", name: "Meyveli Yulaf", time: "12 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 198, comments: 15, author: "Nur P.", aColor: "#34d399", image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80" },
      { id: "h4", name: "Ton Balıklı Salata", time: "14 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 145, comments: 10, author: "Kerem V.", aColor: "#fb923c", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80" },
      { id: "h5", name: "Avokado Sandviç", time: "9 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 276, comments: 22, author: "İrem L.", aColor: "#e879a0", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80" },
      { id: "h6", name: "Smoothie", time: "6 dk", difficulty: "Kolay", dColor: "#22c55e", likes: 410, comments: 30, author: "Yiğit E.", aColor: "#f472b6", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80" },
    ],
  },
];

/* ─── SVG İkonları ─── */
const SearchIcon = () => (
  <svg className="h-5 w-5 text-[#9c7a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "white"} strokeWidth={2}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "#c84f03" : "none"} stroke={filled ? "#c84f03" : "white"} strokeWidth={2}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
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

/* ─── Ana Sayfa Bileşeni ─── */
export default function HomeClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [likedCards, setLikedCards] = useState(new Set());
  const [savedCards, setSavedCards] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tarifler?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleLike = (id) => {
    setLikedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id) => {
    setSavedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SiteLayout>
      {/* ═══════════ HERO BANNER ═══════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-[#f1dac3] bg-gradient-to-br from-[#fff8ef] via-[#ffe8cc] to-[#ffd6a5] p-6 shadow-[0_16px_48px_rgba(126,74,38,0.14)] sm:p-10 md:p-14">
        {/* Dekoratif arka plan elemanları */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#c84f03] opacity-[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-[#e8930f] opacity-[0.08] blur-3xl" />
        <div className="pointer-events-none absolute right-[15%] top-[10%] hidden text-5xl opacity-80 animate-float md:block" aria-hidden="true">🍕</div>
        <div className="pointer-events-none absolute left-[8%] top-[60%] hidden text-4xl opacity-70 animate-float delay-3 md:block" aria-hidden="true">🥘</div>
        <div className="pointer-events-none absolute right-[30%] bottom-[5%] hidden text-4xl opacity-60 animate-float delay-5 md:block" aria-hidden="true">🍰</div>

        {/* Hero içerik */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="animate-fade-in-up font-[var(--font-display)] text-4xl font-extrabold leading-tight text-[#3d1e00] sm:text-5xl md:text-6xl">
            Binlerce Tarif,{" "}
            <span className="bg-gradient-to-r from-[#c84f03] to-[#e8930f] bg-clip-text text-transparent">
              Sonsuz Lezzet
            </span>
          </h1>
          <p className="animate-fade-in-up delay-1 mt-4 text-base text-[#6f5440] sm:text-lg">
            Türkiye'nin en sevilen tarif platformunda yeni lezzetler keşfet, kendi tariflerini paylaş!
          </p>

          {/* Arama çubuğu */}
          <form
            onSubmit={handleSearch}
            className="animate-fade-in-up delay-2 search-box mx-auto mt-8 flex items-center gap-3 rounded-full border border-[#f1dac3] bg-white/80 px-5 py-3 shadow-[0_4px_16px_rgba(126,74,38,0.08)] backdrop-blur-sm sm:max-w-lg"
          >
            <SearchIcon />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Kategori hızlı erişim */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`category-pill animate-fade-in-up delay-${i + 1} flex items-center gap-1.5 rounded-full border border-white/60 px-3.5 py-2 text-sm font-semibold text-[#3d1e00] shadow-sm backdrop-blur-sm sm:px-4`}
              style={{ backgroundColor: cat.bg }}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ TARİF BÖLÜMLERİ ═══════════ */}
      {sections.map((section) => (
        <section
          key={section.id}
          className="animate-fade-in rounded-2xl border border-[#f1dac3] bg-gradient-to-b from-white to-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(126,74,38,0.10)] sm:p-5"
        >
          {/* Bölüm başlığı */}
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

          {/* Yatay kaydırmalı kart alanı */}
          <div
            className="hide-scrollbar grid grid-flow-col auto-cols-[calc((100%-2.25rem)/4)] gap-3 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] max-lg:auto-cols-[calc((100%-0.75rem)/2)] max-sm:auto-cols-[85%]"
            role="region"
            aria-label={section.title}
          >
            {section.cards.map((card) => {
              const isLiked = likedCards.has(card.id);
              const isSaved = savedCards.has(card.id);
              return (
                <article
                  key={card.id}
                  className="recipe-card overflow-hidden rounded-xl border border-[#f1dac3] bg-white [scroll-snap-align:start]"
                >
                  {/* Görsel alanı */}
                  <div className="relative h-[180px] overflow-hidden max-sm:h-[200px]">
                    <Image
                      className="recipe-image object-cover"
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Zorluk badge - sol üst */}
                    <span
                      className="absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: card.dColor }}
                    >
                      {card.difficulty}
                    </span>

                    {/* Süre badge - sağ üst */}
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#5f3d25] shadow-sm backdrop-blur-sm">
                      <ClockIcon />
                      {card.time}
                    </span>

                    {/* Kaydet butonu - sağ alt (44px touch target) */}
                    <button
                      onClick={() => toggleSave(card.id)}
                      className="heart-btn absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
                      aria-label="Kaydet"
                    >
                      <BookmarkIcon filled={isSaved} />
                    </button>

                    {/* Beğeni/yorum - sol alt (görsel üzeri) */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2.5 text-[11px] font-semibold text-white">
                      <span className="flex items-center gap-1">
                        <HeartIcon filled={false} />
                        {isLiked ? card.likes + 1 : card.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <CommentIcon />
                        {card.comments}
                      </span>
                    </div>
                  </div>

                  {/* Kart altı bilgi */}
                  <div className="grid gap-2 p-3">
                    <h3 className="font-[var(--font-display)] text-lg font-bold leading-tight text-[#2f2318]">
                      {card.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      {/* Yazar */}
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: card.aColor }}
                        >
                          {card.author.charAt(0)}
                        </span>
                        <span className="text-xs text-[#7f6248]">{card.author}</span>
                      </div>
                      {/* Beğeni butonu */}
                      <button
                        onClick={() => toggleLike(card.id)}
                        className={`heart-btn flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          isLiked
                            ? "bg-red-50 text-red-500"
                            : "bg-[#fff5eb] text-[#7f6248] hover:bg-red-50 hover:text-red-400"
                        }`}
                      >
                        <HeartIcon filled={isLiked} />
                        <span>{isLiked ? card.likes + 1 : card.likes}</span>
                      </button>
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
