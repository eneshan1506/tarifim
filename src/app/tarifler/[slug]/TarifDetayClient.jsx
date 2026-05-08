"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SiteLayout from "@/components/SiteLayout";
import { recipes, categories } from "@/data/mockData";

/* ─── Mock yapılış adımları ─── */
const mockSteps = [
  "Malzemeleri hazırlayın ve ölçüleri ayarlayın.",
  "Orta ateşte tencereyi ısıtın, yağı ekleyin.",
  "Soğanları pembeleşene kadar kavurun.",
  "Domatesleri rendeleyin ve ekleyin, 5 dakika pişirin.",
  "Baharatları ekleyin ve karıştırın.",
  "Su ekleyip kısık ateşte 25-30 dakika pişirin.",
  "Tuzunu kontrol edin, sıcak servis yapın.",
];

/* ─── Malzeme verisi: baseAmount + unit ile dinamik hesaplama ─── */
const DEFAULT_SERVINGS = 4;
const mockIngredients = [
  { name: "Soğan",       baseAmount: 2,   unit: "adet" },
  { name: "Domates",     baseAmount: 3,   unit: "adet" },
  { name: "Zeytinyağı",  baseAmount: 3,   unit: "yemek kaşığı" },
  { name: "Tuz",         baseAmount: 1,   unit: "tatlı kaşığı" },
  { name: "Karabiber",   baseAmount: 1,   unit: "çay kaşığı" },
  { name: "Pul biber",   baseAmount: 1,   unit: "çay kaşığı" },
  { name: "Su",          baseAmount: 2,   unit: "su bardağı" },
  { name: "Sarımsak",    baseAmount: 3,   unit: "diş" },
];

/* ─── Porsiyon başına malzeme miktarı hesapla ─── */
function calcAmount(baseAmount, unit, servings) {
  const ratio = servings / DEFAULT_SERVINGS;
  const result = baseAmount * ratio;
  // Tam sayıya yakınsa tam göster, değilse 1 ondalık
  const display = Number.isInteger(result) ? result : parseFloat(result.toFixed(1));
  return `${display} ${unit}`;
}

/* ─── Mock yorumlar ─── */
const mockComments = [
  { id: 1, author: "Elif S.",  aColor: "#e8930f", text: "Harika bir tarif! Ailecek çok sevdik 👏",          date: "2 gün önce",  likes: 12 },
  { id: 2, author: "Murat K.", aColor: "#2563eb", text: "Ben biraz daha az tuz koydum, mükemmel oldu.",     date: "5 gün önce",  likes: 8  },
  { id: 3, author: "Derya N.", aColor: "#db2777", text: "Tarifin videolu hali de olsa harika olur!",        date: "1 hafta önce", likes: 5 },
];

/* ─── Tarif detay sayfasında kullanılacak hero görselleri ─── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
];

/* Slug'dan deterministik bir hero görseli seç */
function getHeroImage(slug = "") {
  const idx = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % HERO_IMAGES.length;
  return HERO_IMAGES[idx];
}

/* ─── Wake Lock Hook ─── */
function useWakeLock() {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let released = false;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock desteklenmiyor veya izin reddedildi — sessizce geç
      }
    }

    async function handleVisibilityChange() {
      if (document.visibilityState === "visible" && !released) {
        await requestWakeLock();
      }
    }

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);
}

/* ════════════════════════════════════════════════ */
export default function TarifDetayClient({ slug }) {
  const recipe = recipes.find((r) => r.slug === slug);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  const [commentText, setCommentText] = useState("");

  // Ekran kapanmasını engelle (mutfak modu)
  useWakeLock();

  const toggleStep = (i) =>
    setCheckedSteps((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const toggleIngredient = (i) =>
    setCheckedIngredients((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  if (!recipe) {
    return (
      <SiteLayout>
        <div className="py-20 text-center animate-fade-in">
          <p className="text-7xl mb-6">🍽️</p>
          <h1 className="text-2xl font-bold text-[#953700] mb-3">Tarif Bulunamadı</h1>
          <p className="text-[#7f6248] mb-6">Aradığınız tarif mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/tarifler" className="rounded-full bg-[#c84f03] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors">
            Tüm Tarifler
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const cat     = categories.find((c) => c.slug === recipe.category);
  const related = recipes.filter((r) => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);
  const heroImg = recipe.image || getHeroImage(slug);

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-[#7f6248] animate-fade-in">
        <Link href="/" className="hover:text-[#c84f03] transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/tarifler" className="hover:text-[#c84f03] transition-colors">Tarifler</Link>
        <span>/</span>
        <span className="text-[#2f2318] font-medium">{recipe.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol: Ana içerik */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Hero Görsel ── */}
          <div className="relative overflow-hidden rounded-2xl border border-[#f1dac3] animate-fade-in-up" style={{ height: "340px" }}>
            <Image
              src={heroImg}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            {/* Karanlık gradient overlay — okunabilirlik için */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Sol üst badge'ler */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="rounded-full px-3 py-1 text-xs font-bold text-white shadow" style={{ background: recipe.dColor }}>
                {recipe.difficulty}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#2f2318] backdrop-blur">
                ⏰ {recipe.time} dk
              </span>
            </div>

            {/* Sağ üst butonlar (44px touch target) */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button
                onClick={() => setLiked(!liked)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-lg hover:bg-black/50 transition-colors"
                aria-label={liked ? "Beğeniyi geri al" : "Beğen"}
              >
                {liked ? "❤️" : "🤍"}
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className="flex h-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm px-3 text-xs font-semibold text-white hover:bg-black/50 transition-colors"
                aria-label={saved ? "Kaydı kaldır" : "Kaydet"}
              >
                {saved ? "🔖" : "🏷️"} Kaydet
              </button>
            </div>

            {/* Sol alt: Beğeni sayısı */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="text-sm font-bold text-white drop-shadow">
                ❤️ {recipe.likes + (liked ? 1 : 0)} beğeni
              </span>
            </div>
          </div>

          {/* ── Başlık ve meta ── */}
          <div className="animate-fade-in-up delay-1">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/tarifler?kategori=${recipe.category}`}
                className="rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:opacity-80"
                style={{ background: cat?.color, color: cat?.accent }}
              >
                {cat?.emoji} {cat?.label}
              </Link>
            </div>
            <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#2f2318] sm:text-4xl">{recipe.title}</h1>
            <p className="mt-3 text-[#7f6248] leading-relaxed">{recipe.desc}</p>

            {/* Yazar */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#f1dac3] bg-[#fffdf8] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: recipe.aColor }}>
                {recipe.author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2f2318]">{recipe.author}</p>
                <p className="text-xs text-[#7f6248]">Tarif sahibi</p>
              </div>
            </div>
          </div>

          {/* ── Yapılış adımları ── */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-2">
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[#953700] mb-4">📝 Yapılış</h2>
            <div className="space-y-3">
              {mockSteps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all min-h-[44px] ${
                    checkedSteps.has(i)
                      ? "bg-[#f0fdf4] border border-green-200"
                      : "bg-[#fffdf8] border border-[#f1dac3] hover:border-[#e8930f]"
                  }`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    checkedSteps.has(i) ? "bg-green-500 text-white" : "bg-[#c84f03] text-white"
                  }`}>
                    {checkedSteps.has(i) ? "✓" : i + 1}
                  </span>
                  <span className={`text-sm leading-relaxed ${checkedSteps.has(i) ? "text-green-700 line-through" : "text-[#2f2318]"}`}>
                    {step}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#b89a7c] text-center">
              {checkedSteps.size}/{mockSteps.length} adım tamamlandı
            </p>
          </div>

          {/* ── Yorumlar ── */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-3">
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[#953700] mb-4">💬 Yorumlar ({mockComments.length})</h2>

            {/* Yorum yaz */}
            <div className="mb-5 rounded-xl border border-[#f1dac3] bg-[#fffdf8] p-3">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bu tarif hakkında ne düşünüyorsunuz?"
                className="w-full resize-none bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
              />
              <div className="flex justify-end mt-2">
                <button
                  className="rounded-full bg-[#c84f03] px-5 py-2 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors disabled:opacity-40 min-h-[44px]"
                  disabled={!commentText.trim()}
                >
                  Gönder
                </button>
              </div>
            </div>

            {/* Yorum listesi */}
            <div className="space-y-4">
              {mockComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: c.aColor }}>
                    {c.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#2f2318]">{c.author}</span>
                      <span className="text-xs text-[#b89a7c]">{c.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#5f3d25]">{c.text}</p>
                    <button className="mt-1 flex items-center gap-1 min-h-[44px] text-xs text-[#b89a7c] hover:text-[#c84f03] transition-colors">
                      ❤️ {c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sağ Sidebar ── */}
        <aside className="space-y-5">

          {/* Bilgi + Porsiyon kartı */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-1">
            <h3 className="font-semibold text-[#953700] mb-3">📊 Bilgiler</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⏰", label: "Süre",     value: `${recipe.time} dk` },
                { icon: "📊", label: "Zorluk",   value: recipe.difficulty },
                { icon: "🍽️", label: "Porsiyon", value: `${servings} kişilik` },
                { icon: "❤️", label: "Beğeni",   value: recipe.likes + (liked ? 1 : 0) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#fffdf8] border border-[#f1dac3] p-3 text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-xs text-[#7f6248] mt-1">{item.label}</p>
                  <p className="text-sm font-bold text-[#2f2318]">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Porsiyon ayarı — 44px touch target */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="h-11 w-11 rounded-full border-2 border-[#f1dac3] text-[#c84f03] text-xl font-bold hover:bg-[#fff5eb] hover:border-[#c84f03] transition-all flex items-center justify-center"
                aria-label="Porsiyon azalt"
              >
                −
              </button>
              <span className="text-sm font-bold text-[#2f2318] min-w-[80px] text-center">
                {servings} porsiyon
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="h-11 w-11 rounded-full border-2 border-[#f1dac3] text-[#c84f03] text-xl font-bold hover:bg-[#fff5eb] hover:border-[#c84f03] transition-all flex items-center justify-center"
                aria-label="Porsiyon artır"
              >
                +
              </button>
            </div>
          </div>

          {/* Malzemeler — dinamik porsiyon hesaplamalı */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-2">
            <h3 className="font-semibold text-[#953700] mb-3">🧂 Malzemeler</h3>
            <ul className="space-y-1">
              {mockIngredients.map((ing, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleIngredient(i)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-all min-h-[44px] ${
                      checkedIngredients.has(i)
                        ? "bg-[#f0fdf4] text-green-700"
                        : "hover:bg-[#fffdf8] text-[#2f2318]"
                    }`}
                  >
                    {/* Checkbox — okunabilir boyut */}
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                      checkedIngredients.has(i)
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-[#d1c4b5] text-transparent"
                    }`}>
                      ✓
                    </span>
                    <span className={`flex-1 ${checkedIngredients.has(i) ? "line-through" : ""}`}>
                      {ing.name}
                    </span>
                    {/* Dinamik miktar */}
                    <span className="text-xs font-semibold text-[#b89a7c] whitespace-nowrap">
                      {calcAmount(ing.baseAmount, ing.unit, servings)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[#b89a7c] text-center">
              {checkedIngredients.size}/{mockIngredients.length} malzeme hazır
            </p>
          </div>

          {/* İlgili tarifler */}
          {related.length > 0 && (
            <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-3">
              <h3 className="font-semibold text-[#953700] mb-3">🔗 Benzer Tarifler</h3>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/tarifler/${r.slug}`}
                    className="flex items-center gap-3 rounded-xl p-2 min-h-[44px] transition-colors hover:bg-[#fff5eb]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl shrink-0" style={{ background: cat?.color }}>
                      {cat?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2f2318] truncate">{r.title}</p>
                      <p className="text-xs text-[#7f6248]">⏰ {r.time} dk · ❤️ {r.likes}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </SiteLayout>
  );
}
