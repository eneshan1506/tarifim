"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";

const tabs = ["Tariflerim", "Favoriler", "Hakkımda"];

function formatJoinDate(value) {
  if (!value) {
    return "Yeni üye";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilClient({ profile }) {
  const [activeTab, setActiveTab] = useState("Tariflerim");
  const user = profile?.user;
  const recipes = profile?.recipes || [];

  if (!user) {
    return (
      <SiteLayout>
        <div className="py-20 text-center">
          <p className="text-lg text-[#7f6248]">Profil bilgisi bulunamadı.</p>
        </div>
      </SiteLayout>
    );
  }

  const userProfile = {
    name: user.name,
    email: user.email,
    joined: formatJoinDate(user.createdAt),
    bio: user.bio || "Tariflerini keşfetmeye, favorilerini düzenlemeye ve topluluk içinde yer almaya hazır.",
    recipes: user.recipesCount,
    favorites: user.favoritesCount,
    followers: 0,
    following: 0,
    color: "#e8930f",
  };

  return (
    <SiteLayout>
      <div className="rounded-2xl bg-gradient-to-r from-[#fff8ef] via-[#ffe8cc] to-[#ffd6a5] p-6 shadow-[0_18px_42px_rgba(126,74,38,0.12)] sm:p-8 animate-fade-in-up">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${userProfile.color}, #c84f03)` }}>
            {userProfile.name[0]}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-[#2f2318]">{userProfile.name}</h1>
            <p className="mt-1 text-sm text-[#7f6248]">{userProfile.bio}</p>
            <p className="mt-1 text-sm font-medium text-[#5f3d25]">{userProfile.email}</p>
            <p className="mt-1 text-xs text-[#b89a7c]">Üyelik: {userProfile.joined}</p>
          </div>
          <button className="rounded-full border border-[#c84f03] px-5 py-2 text-sm font-semibold text-[#c84f03] transition-all hover:bg-[#c84f03] hover:text-white">
            Profili Düzenle
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Tarif", value: userProfile.recipes, icon: "📝" },
            { label: "Favori", value: userProfile.favorites, icon: "❤️" },
            { label: "Takip", value: userProfile.following, icon: "➡️" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/70 p-3 text-center backdrop-blur">
              <p className="text-lg">{stat.icon}</p>
              <p className="text-xl font-bold text-[#2f2318]">{stat.value}</p>
              <p className="text-xs text-[#7f6248]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2 animate-fade-in-up delay-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab ? "bg-[#c84f03] text-white shadow" : "bg-[#fffdf8] text-[#7f6248] shadow-sm ring-1 ring-[#f1dac3]/60 hover:bg-[#fff5eb]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-5 animate-fade-in-up delay-2">
        {activeTab === "Tariflerim" && (
          recipes.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70">
              <p className="text-sm text-[#5f3d25]">Henüz paylaşılmış tarifiniz yok.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="group rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70 transition-all hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(126,74,38,0.12)]">
                  <Link href={`/tarifler/${recipe.slug}`}>
                    <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5] text-5xl">
                      🍽️
                    </div>
                    <h3 className="font-semibold text-[#2f2318] transition-colors group-hover:text-[#c84f03]">{recipe.title}</h3>
                    <p className="mt-1 text-xs text-[#7f6248]">❤️ {recipe.likes} · 💬 {recipe.comments} · ⏰ {recipe.time} dk</p>
                  </Link>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/tarifler/${recipe.slug}/duzenle`} className="rounded-full bg-[#fff5eb] px-3 py-1.5 text-xs font-semibold text-[#c84f03]">
                      Düzenle
                    </Link>
                    <Link href={`/tarifler/${recipe.slug}`} className="rounded-full bg-[#2f2318] px-3 py-1.5 text-xs font-semibold text-white">
                      Gör
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "Favoriler" && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70">
            <h3 className="mb-2 font-semibold text-[#953700]">Korumalı favori alanı</h3>
            <p className="text-sm text-[#5f3d25]">
              Şu an hesabınızda <strong>{userProfile.favorites}</strong> favori tarif kayıtlı. Tüm favori listesini görmek için{" "}
              <Link href="/favoriler" className="font-semibold text-[#c84f03] hover:underline">
                favoriler sayfasına
              </Link>{" "}
              geçebilirsiniz.
            </p>
          </div>
        )}

        {activeTab === "Hakkımda" && (
          <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70">
            <h3 className="mb-3 font-semibold text-[#953700]">👩‍🍳 Hakkımda</h3>
            <p className="mb-4 text-sm leading-relaxed text-[#5f3d25]">
              Profil sayfanız artık gerçek veritabanı verisi ile açılıyor. Bu yapı ileride tarif oluşturma, favori senkronizasyonu ve hesap ayarları için temel sağlar.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[#f1dac3] bg-[#fffdf8] p-3">
                <p className="text-xs text-[#b89a7c]">📧 E-posta</p>
                <p className="font-medium text-[#2f2318]">{userProfile.email}</p>
              </div>
              <div className="rounded-xl border border-[#f1dac3] bg-[#fffdf8] p-3">
                <p className="text-xs text-[#b89a7c]">🔐 Oturum</p>
                <p className="font-medium text-[#2f2318]">Etkin</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
