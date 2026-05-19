"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";

function formatAmount(baseAmount, unit) {
  if (baseAmount === null || Number.isNaN(baseAmount)) {
    return unit || "-";
  }

  const display = Number.isInteger(baseAmount) ? baseAmount : parseFloat(baseAmount.toFixed(1));
  return `${display} ${unit}`;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
];

function getHeroImage(slug = "") {
  const idx = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % HERO_IMAGES.length;
  return HERO_IMAGES[idx];
}

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
        // Wake Lock desteklenmiyorsa sessizce devam et.
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

function getAuthorColor(name) {
  const colors = ["#e8930f", "#059669", "#db2777", "#c84f03", "#2563eb", "#7c3aed", "#65a30d", "#ea580c"];
  const total = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[total % colors.length];
}

export default function TarifDetayClient({ detail, slug, initialSaved = false, viewerUserId = null }) {
  const router = useRouter();
  const recipe = detail?.recipe;
  const category = detail?.category;
  const related = detail?.related || [];
  const [isFavorite, setIsFavorite] = useState(initialSaved);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(recipe?.comments || []);
  const [favoritePending, startFavoriteTransition] = useTransition();
  const [commentPending, startCommentTransition] = useTransition();

  useWakeLock();

  const toggleStep = (index) =>
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });

  const toggleIngredient = (index) =>
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });

  if (!recipe) {
    return (
      <SiteLayout>
        <div className="py-20 text-center animate-fade-in">
          <p className="mb-6 text-7xl">🍽️</p>
          <h1 className="mb-3 text-2xl font-bold text-[#953700]">Tarif Bulunamadı</h1>
          <p className="mb-6 text-[#7f6248]">Aradığınız tarif mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/tarifler" className="rounded-full bg-[#c84f03] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a03d02]">
            Tüm Tarifler
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const heroImg = recipe.image || getHeroImage(slug);
  const isOwner = viewerUserId && recipe.authorId === viewerUserId;

  const handleFavoriteToggle = () => {
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);

    startFavoriteTransition(async () => {
      const response = await fetch(`/api/favorites/${recipe.id}`, {
        method: nextValue ? "POST" : "DELETE",
      });

      if (!response.ok) {
        setIsFavorite(!nextValue);

        if (response.status === 401) {
          router.push("/giris");
        }
      }
    });
  };

  const handleCommentSubmit = () => {
    const body = commentText.trim();

    if (!body) {
      return;
    }

    startCommentTransition(async () => {
      const response = await fetch(`/api/recipes/${recipe.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        if (response.status === 401) {
          router.push("/giris");
        }
        return;
      }

      setComments((prev) => [
        {
          ...result.comment,
          aColor: getAuthorColor(result.comment.author),
        },
        ...prev,
      ]);
      setCommentText("");
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Bu tarifi silmek istediğinize emin misiniz?")) {
      return;
    }

    startCommentTransition(async () => {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      router.push("/profil");
      router.refresh();
    });
  };

  return (
    <SiteLayout>
      <nav className="mb-4 flex items-center gap-2 text-sm text-[#7f6248] animate-fade-in">
        <Link href="/" className="transition-colors hover:text-[#c84f03]">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/tarifler" className="transition-colors hover:text-[#c84f03]">Tarifler</Link>
        <span>/</span>
        <span className="font-medium text-[#2f2318]">{recipe.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl animate-fade-in-up ring-1 ring-[#f1dac3]/60" style={{ height: "340px" }}>
            <Image
              src={heroImg}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <span className="rounded-full bg-[#c84f03] px-3 py-1 text-xs font-bold text-white shadow">
                {recipe.difficulty}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#2f2318] backdrop-blur">
                ⏰ {recipe.time} dk
              </span>
            </div>

            <div className="absolute right-3 top-3 z-10 flex gap-2">
              <button
                onClick={handleFavoriteToggle}
                disabled={favoritePending}
                className="flex h-11 items-center justify-center rounded-full bg-black/30 px-4 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50 disabled:opacity-60"
                aria-label={isFavorite ? "Favoriden cikar" : "Favoriye ekle"}
              >
                {isFavorite ? "❤️ Favoride" : "🤍 Favori"}
              </button>
            </div>

            <div className="absolute bottom-4 left-4 z-10">
              <span className="text-sm font-bold text-white drop-shadow">
                ❤️ {recipe.likes} favori
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up delay-1">
            <div className="mb-2 flex items-center gap-2">
              <Link
                href={`/tarifler?kategori=${recipe.category}`}
                className="rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:opacity-80"
                style={{ background: category?.color, color: category?.accent }}
              >
                {category?.emoji} {category?.label}
              </Link>
            </div>
            <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#2f2318] sm:text-4xl">{recipe.title}</h1>
            <p className="mt-3 leading-relaxed text-[#7f6248]">{recipe.desc}</p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#fffdf8] p-3 ring-1 ring-[#f1dac3]/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: recipe.aColor }}>
                {recipe.author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2f2318]">{recipe.author}</p>
                <p className="text-xs text-[#7f6248]">Tarif sahibi</p>
              </div>
            </div>

            {isOwner ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/tarifler/${recipe.slug}/duzenle`} className="rounded-full bg-[#2f2318] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a3727]">
                  Tarifi Düzenle
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={commentPending}
                  className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
                >
                  Tarifi Sil
                </button>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-2">
            <h2 className="mb-4 font-[var(--font-display)] text-xl font-bold text-[#953700]">📝 Yapılış</h2>
            <div className="space-y-3">
              {recipe.steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => toggleStep(index)}
                  className={`flex min-h-[44px] w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                    checkedSteps.has(index)
                      ? "border border-green-200 bg-[#f0fdf4]"
                      : "border border-[#f1dac3] bg-[#fffdf8] hover:border-[#e8930f]"
                  }`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    checkedSteps.has(index) ? "bg-green-500 text-white" : "bg-[#c84f03] text-white"
                  }`}>
                    {checkedSteps.has(index) ? "✓" : index + 1}
                  </span>
                  <span className={`text-sm leading-relaxed ${checkedSteps.has(index) ? "line-through text-green-700" : "text-[#2f2318]"}`}>
                    {step}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-[#b89a7c]">
              {checkedSteps.size}/{recipe.steps.length} adım tamamlandı
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-3">
            <h2 className="mb-4 font-[var(--font-display)] text-xl font-bold text-[#953700]">💬 Yorumlar ({comments.length})</h2>

            <div className="mb-5 rounded-xl bg-[#fffdf8] p-3 ring-1 ring-[#f1dac3]/60">
              <textarea
                rows={3}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Bu tarif hakkında ne düşünüyorsunuz?"
                className="w-full resize-none bg-transparent text-sm text-[#2f2318] outline-none placeholder:text-[#b89a7c]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  className="min-h-[44px] rounded-full bg-[#c84f03] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a03d02] disabled:opacity-40"
                  disabled={!commentText.trim() || commentPending}
                >
                  {commentPending ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: comment.aColor }}>
                    {comment.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#2f2318]">{comment.author}</span>
                      <span className="text-xs text-[#b89a7c]">{comment.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#5f3d25]">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-1">
            <h3 className="mb-3 font-semibold text-[#953700]">📊 Bilgiler</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "⏰", label: "Süre", value: `${recipe.time} dk` },
                { icon: "📊", label: "Zorluk", value: recipe.difficulty },
                { icon: "🍽️", label: "Porsiyon", value: `${recipe.servings} kişilik` },
                { icon: "❤️", label: "Favori", value: recipe.likes },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#fffdf8] p-3 text-center ring-1 ring-[#f1dac3]/60">
                  <p className="text-lg">{item.icon}</p>
                  <p className="mt-1 text-xs text-[#7f6248]">{item.label}</p>
                  <p className="text-sm font-bold text-[#2f2318]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-2">
            <h3 className="mb-3 font-semibold text-[#953700]">🧂 Malzemeler</h3>
            <ul className="space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <button
                    onClick={() => toggleIngredient(index)}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-all ${
                      checkedIngredients.has(index)
                        ? "bg-[#f0fdf4] text-green-700"
                        : "text-[#2f2318] hover:bg-[#fffdf8]"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                      checkedIngredients.has(index)
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-[#d1c4b5] text-transparent"
                    }`}>
                      ✓
                    </span>
                    <span className={`flex-1 ${checkedIngredients.has(index) ? "line-through" : ""}`}>
                      {ingredient.name}
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-[#b89a7c]">
                      {formatAmount(ingredient.baseAmount, ingredient.unit)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-center text-xs text-[#b89a7c]">
              {checkedIngredients.size}/{recipe.ingredients.length} malzeme hazır
            </p>
          </div>

          {related.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-3">
              <h3 className="mb-3 font-semibold text-[#953700]">🔗 Benzer Tarifler</h3>
              <div className="space-y-2">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/tarifler/${item.slug}`}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#fff5eb]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl" style={{ background: category?.color }}>
                      {category?.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#2f2318]">{item.title}</p>
                      <p className="text-xs text-[#7f6248]">⏰ {item.time} dk · ❤️ {item.likes}</p>
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
