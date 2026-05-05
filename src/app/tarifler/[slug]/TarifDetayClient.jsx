"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { recipes, categories } from "@/data/mockData";

/* Mock yapılış adımları */
const mockSteps = [
  "Malzemeleri hazırlayın ve ölçüleri ayarlayın.",
  "Orta ateşte tencereyi ısıtın, yağı ekleyin.",
  "Soğanları pembeleşene kadar kavurun.",
  "Domatesleri rendeleyin ve ekleyin, 5 dakika pişirin.",
  "Baharatları ekleyin ve karıştırın.",
  "Su ekleyip kısık ateşte 25-30 dakika pişirin.",
  "Tuzunu kontrol edin, sıcak servis yapın.",
];

const mockIngredients = [
  { name: "Soğan", amount: "2 adet" },
  { name: "Domates", amount: "3 adet" },
  { name: "Zeytinyağı", amount: "3 yemek kaşığı" },
  { name: "Tuz", amount: "1 tatlı kaşığı" },
  { name: "Karabiber", amount: "1 çay kaşığı" },
  { name: "Pul biber", amount: "1 çay kaşığı" },
  { name: "Su", amount: "2 su bardağı" },
  { name: "Sarımsak", amount: "3 diş" },
];

const mockComments = [
  { id: 1, author: "Elif S.", aColor: "#e8930f", text: "Harika bir tarif! Ailecek çok sevdik 👏", date: "2 gün önce", likes: 12 },
  { id: 2, author: "Murat K.", aColor: "#2563eb", text: "Ben biraz daha az tuz koydum, mükemmel oldu.", date: "5 gün önce", likes: 8 },
  { id: 3, author: "Derya N.", aColor: "#db2777", text: "Tarifin videolu hali de olsa harika olur!", date: "1 hafta önce", likes: 5 },
];

export default function TarifDetayClient({ slug }) {
  const recipe = recipes.find((r) => r.slug === slug);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [servings, setServings] = useState(4);
  const [commentText, setCommentText] = useState("");

  const toggleStep = (i) => setCheckedSteps((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });
  const toggleIngredient = (i) => setCheckedIngredients((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

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

  const cat = categories.find((c) => c.slug === recipe.category);
  const related = recipes.filter((r) => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);

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
          {/* Hero görsel */}
          <div className="relative overflow-hidden rounded-2xl border border-[#f1dac3] bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5] animate-fade-in-up">
            <div className="flex h-64 sm:h-80 items-center justify-center text-8xl">
              {cat?.emoji || "🍽️"}
            </div>
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: recipe.dColor }}>
                {recipe.difficulty}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#2f2318] backdrop-blur">
                ⏰ {recipe.time} dk
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => setLiked(!liked)} className="rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur hover:bg-white transition-colors">
                {liked ? "❤️" : "🤍"} {recipe.likes + (liked ? 1 : 0)}
              </button>
              <button onClick={() => setSaved(!saved)} className="rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur hover:bg-white transition-colors">
                {saved ? "🔖" : "🏷️"} Kaydet
              </button>
            </div>
          </div>

          {/* Başlık ve meta */}
          <div className="animate-fade-in-up delay-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/tarifler?kategori=${recipe.category}`} className="rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:opacity-80" style={{ background: cat?.color, color: cat?.accent }}>
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

          {/* Yapılış adımları */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-2">
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[#953700] mb-4">📝 Yapılış</h2>
            <div className="space-y-3">
              {mockSteps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${checkedSteps.has(i) ? "bg-[#f0fdf4] border border-green-200" : "bg-[#fffdf8] border border-[#f1dac3] hover:border-[#e8930f]"}`}
                >
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${checkedSteps.has(i) ? "bg-green-500 text-white" : "bg-[#c84f03] text-white"}`}>
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

          {/* Yorumlar */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-3">
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[#953700] mb-4">💬 Yorumlar ({mockComments.length})</h2>

            {/* Yorum yaz */}
            <div className="mb-5 rounded-xl border border-[#f1dac3] bg-[#fffdf8] p-3">
              <textarea
                rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bu tarif hakkında ne düşünüyorsunuz?"
                className="w-full resize-none bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
              />
              <div className="flex justify-end mt-2">
                <button className="rounded-full bg-[#c84f03] px-5 py-1.5 text-xs font-semibold text-white hover:bg-[#a03d02] transition-colors disabled:opacity-40" disabled={!commentText.trim()}>
                  Gönder
                </button>
              </div>
            </div>

            {/* Yorum listesi */}
            <div className="space-y-4">
              {mockComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: c.aColor }}>
                    {c.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#2f2318]">{c.author}</span>
                      <span className="text-xs text-[#b89a7c]">{c.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#5f3d25]">{c.text}</p>
                    <button className="mt-1 text-xs text-[#b89a7c] hover:text-[#c84f03] transition-colors">
                      ❤️ {c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ sidebar */}
        <aside className="space-y-5">
          {/* Bilgi kartı */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-1">
            <h3 className="font-semibold text-[#953700] mb-3">📊 Bilgiler</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⏰", label: "Süre", value: `${recipe.time} dk` },
                { icon: "📊", label: "Zorluk", value: recipe.difficulty },
                { icon: "🍽️", label: "Porsiyon", value: `${servings} kişilik` },
                { icon: "❤️", label: "Beğeni", value: recipe.likes },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#fffdf8] border border-[#f1dac3] p-3 text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-[10px] text-[#7f6248] mt-1">{item.label}</p>
                  <p className="text-sm font-bold text-[#2f2318]">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Porsiyon ayarı */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="h-8 w-8 rounded-full border border-[#f1dac3] text-[#c84f03] font-bold hover:bg-[#fff5eb] transition-colors">-</button>
              <span className="text-sm font-semibold text-[#2f2318]">{servings} porsiyon</span>
              <button onClick={() => setServings(servings + 1)} className="h-8 w-8 rounded-full border border-[#f1dac3] text-[#c84f03] font-bold hover:bg-[#fff5eb] transition-colors">+</button>
            </div>
          </div>

          {/* Malzemeler */}
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-5 shadow-sm animate-fade-in-up delay-2">
            <h3 className="font-semibold text-[#953700] mb-3">🧂 Malzemeler</h3>
            <ul className="space-y-2">
              {mockIngredients.map((ing, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleIngredient(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-all ${checkedIngredients.has(i) ? "bg-[#f0fdf4] text-green-700 line-through" : "hover:bg-[#fffdf8] text-[#2f2318]"}`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] ${checkedIngredients.has(i) ? "border-green-500 bg-green-500 text-white" : "border-[#d1c4b5]"}`}>
                      {checkedIngredients.has(i) && "✓"}
                    </span>
                    <span className="flex-1">{ing.name}</span>
                    <span className="text-xs text-[#b89a7c]">{ing.amount}</span>
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
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/tarifler/${r.slug}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#fff5eb]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl" style={{ background: cat?.color }}>
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
