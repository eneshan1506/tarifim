"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { recipes, categories } from "@/data/mockData";

const userProfile = {
  name: "Ayşe Kaya",
  email: "ayse@tarifim.com",
  joined: "Ocak 2025",
  bio: "Yemek yapmayı ve paylaşmayı seven bir gurme 🍳",
  recipes: 48,
  followers: 1240,
  following: 86,
  color: "#e8930f",
};

const tabs = ["Tariflerim", "Favoriler", "Hakkımda"];

export default function ProfilClient() {
  const [activeTab, setActiveTab] = useState("Tariflerim");
  const myRecipes = recipes.slice(0, 4);

  return (
    <SiteLayout>
      {/* Profil header */}
      <div className="rounded-2xl border border-[#f1dac3] bg-gradient-to-r from-[#fff8ef] via-[#ffe8cc] to-[#ffd6a5] p-6 sm:p-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${userProfile.color}, #c84f03)` }}>
            {userProfile.name[0]}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-[#2f2318]">{userProfile.name}</h1>
            <p className="text-sm text-[#7f6248] mt-1">{userProfile.bio}</p>
            <p className="text-xs text-[#b89a7c] mt-1">Üyelik: {userProfile.joined}</p>
          </div>
          <button className="rounded-full border border-[#c84f03] px-5 py-2 text-sm font-semibold text-[#c84f03] hover:bg-[#c84f03] hover:text-white transition-all">
            Profili Düzenle
          </button>
        </div>

        {/* İstatistikler */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Tarif", value: userProfile.recipes, icon: "📝" },
            { label: "Takipçi", value: userProfile.followers, icon: "👥" },
            { label: "Takip", value: userProfile.following, icon: "➡️" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/70 backdrop-blur p-3 text-center">
              <p className="text-lg">{s.icon}</p>
              <p className="text-xl font-bold text-[#2f2318]">{s.value}</p>
              <p className="text-xs text-[#7f6248]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 animate-fade-in-up delay-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab ? "bg-[#c84f03] text-white shadow" : "bg-[#fffdf8] text-[#7f6248] border border-[#f1dac3] hover:bg-[#fff5eb]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab içerikleri */}
      <div className="mt-5 animate-fade-in-up delay-2">
        {activeTab === "Tariflerim" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myRecipes.map((r) => {
              const cat = categories.find((c) => c.slug === r.category);
              return (
                <Link key={r.id} href={`/tarifler/${r.slug}`} className="group rounded-2xl border border-[#f1dac3] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5] text-5xl mb-3">
                    {cat?.emoji || "🍽️"}
                  </div>
                  <h3 className="font-semibold text-[#2f2318] group-hover:text-[#c84f03] transition-colors">{r.title}</h3>
                  <p className="mt-1 text-xs text-[#7f6248]">❤️ {r.likes} · 💬 {r.comments} · ⏰ {r.time} dk</p>
                </Link>
              );
            })}
            <button className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[#f1dac3] p-4 text-[#b89a7c] transition-all hover:border-[#c84f03] hover:text-[#c84f03] min-h-[200px]">
              <div className="text-center">
                <p className="text-4xl mb-2">+</p>
                <p className="text-sm font-semibold">Yeni Tarif Ekle</p>
              </div>
            </button>
          </div>
        )}

        {activeTab === "Favoriler" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(2, 6).map((r) => {
              const cat = categories.find((c) => c.slug === r.category);
              return (
                <Link key={r.id} href={`/tarifler/${r.slug}`} className="group rounded-2xl border border-[#f1dac3] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffe8cc] to-[#ffd6a5] text-5xl mb-3">
                    {cat?.emoji || "🍽️"}
                  </div>
                  <h3 className="font-semibold text-[#2f2318] group-hover:text-[#c84f03] transition-colors">{r.title}</h3>
                  <p className="mt-1 text-xs text-[#7f6248]">👤 {r.author} · ❤️ {r.likes}</p>
                </Link>
              );
            })}
          </div>
        )}

        {activeTab === "Hakkımda" && (
          <div className="rounded-2xl border border-[#f1dac3] bg-white p-6 shadow-sm max-w-2xl">
            <h3 className="font-semibold text-[#953700] mb-3">👩‍🍳 Hakkımda</h3>
            <p className="text-sm text-[#5f3d25] leading-relaxed mb-4">
              10 yılı aşkın mutfak deneyimimle Türk ve dünya mutfağından birçok tarifi sizlerle paylaşmaktan keyif alıyorum.
              Özellikle geleneksel Türk yemekleri ve sağlıklı alternatifler üzerine yoğunlaşıyorum.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[#fffdf8] border border-[#f1dac3] p-3">
                <p className="text-xs text-[#b89a7c]">📍 Konum</p>
                <p className="font-medium text-[#2f2318]">İstanbul, Türkiye</p>
              </div>
              <div className="rounded-xl bg-[#fffdf8] border border-[#f1dac3] p-3">
                <p className="text-xs text-[#b89a7c]">🍳 Uzmanlık</p>
                <p className="font-medium text-[#2f2318]">Türk Mutfağı</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
