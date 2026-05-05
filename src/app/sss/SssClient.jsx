"use client";

import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { faqItems } from "@/data/mockData";

export default function SssClient() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center animate-fade-in-up">
          <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">❓ Sık Sorulan Sorular</h1>
          <p className="mt-2 text-[#7f6248]">Merak ettiklerinize hızlı yanıtlar</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[#f1dac3] bg-white shadow-sm transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#fffdf8]"
              >
                <span className="pr-4 text-sm font-semibold text-[#2f2318]">{item.q}</span>
                <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#f1dac3] text-sm font-bold text-[#c84f03] transition-transform ${openIndex === i ? "rotate-45 bg-[#c84f03] text-white border-[#c84f03]" : ""}`}>
                  +
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-48 pb-5" : "max-h-0"}`}>
                <p className="px-5 text-sm text-[#5f3d25] leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alt CTA */}
        <div className="mt-10 rounded-2xl border border-[#f1dac3] bg-gradient-to-r from-[#fff8ef] to-[#ffe8cc] p-6 text-center animate-fade-in-up delay-4">
          <p className="text-2xl mb-2">🤔</p>
          <h3 className="font-semibold text-[#2f2318]">Sorunuz yanıtlanmadı mı?</h3>
          <p className="text-sm text-[#7f6248] mt-1">Bize ulaşın, en kısa sürede yanıtlayalım.</p>
          <a href="/iletisim" className="mt-4 inline-block rounded-full bg-[#c84f03] px-6 py-2 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors">
            İletişime Geç
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
