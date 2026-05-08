"use client";

import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";
import { recipes, categories } from "@/data/mockData";

export default function YeniEklenenlerClient() {
  const newest = [...recipes].sort((a, b) => b.id - a.id);

  return (
    <SiteLayout>
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">🆕 Yeni Eklenenler</h1>
        <p className="mt-2 text-[#7f6248]">Son eklenen <strong>{newest.length}</strong> tarif</p>
      </section>

      <div className="space-y-4">
        {newest.map((r, i) => {
          const cat = categories.find((c) => c.slug === r.category);
          return (
            <Link
              key={r.id}
              href={`/tarifler/${r.slug}`}
              className="group flex gap-4 rounded-2xl border border-[#f1dac3] bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Thumbnail görseli */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: cat?.color, color: cat?.accent }}
                  >
                    {cat?.emoji} {cat?.label}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: r.dColor }}
                  >
                    {r.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-[#2f2318] group-hover:text-[#c84f03] transition-colors truncate">
                  {r.title}
                </h3>
                <p className="text-xs text-[#7f6248] line-clamp-1 mt-0.5">{r.desc}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-[#b89a7c]">
                  <span>👤 {r.author}</span>
                  <span>⏰ {r.time} dk</span>
                  <span>❤️ {r.likes}</span>
                  <span>💬 {r.comments}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SiteLayout>
  );
}
