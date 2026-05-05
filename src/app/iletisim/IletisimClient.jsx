"use client";

import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";

export default function IletisimClient() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in-up">
          <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">📬 İletişim</h1>
          <p className="mt-2 text-[#7f6248]">Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize ulaşın</p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Bilgi kartları */}
          <div className="md:col-span-2 space-y-4 animate-fade-in-up delay-1">
            {[
              { icon: "📧", title: "E-posta", value: "iletisim@tarifim.com", sub: "24 saat içinde yanıt" },
              { icon: "📍", title: "Adres", value: "İstanbul, Türkiye", sub: "Kadıköy / Moda" },
              { icon: "📱", title: "Sosyal Medya", value: "@tarifim", sub: "Instagram, Twitter, YouTube" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#f1dac3] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#2f2318]">{item.title}</p>
                    <p className="text-sm text-[#c84f03] font-medium">{item.value}</p>
                    <p className="text-xs text-[#b89a7c]">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-3 rounded-2xl border border-[#f1dac3] bg-white p-6 shadow-sm animate-fade-in-up delay-2">
            {sent ? (
              <div className="py-12 text-center animate-fade-in">
                <p className="text-6xl mb-4">✅</p>
                <h3 className="text-xl font-bold text-[#953700] mb-2">Mesajınız Gönderildi!</h3>
                <p className="text-sm text-[#7f6248]">En kısa sürede size dönüş yapacağız.</p>
                <button onClick={() => setSent(false)} className="mt-4 rounded-full bg-[#c84f03] px-6 py-2 text-sm font-semibold text-white hover:bg-[#a03d02] transition-colors">
                  Yeni Mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5f3d25]">Ad</label>
                    <input type="text" placeholder="Adınız" required className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5f3d25]">Soyad</label>
                    <input type="text" placeholder="Soyadınız" required className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5f3d25]">E-posta</label>
                  <input type="email" placeholder="ornek@email.com" required className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5f3d25]">Konu</label>
                  <select className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03]">
                    <option>Genel Soru</option>
                    <option>Tarif Önerisi</option>
                    <option>Hata Bildirimi</option>
                    <option>İş Birliği</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5f3d25]">Mesaj</label>
                  <textarea rows={4} placeholder="Mesajınızı yazın..." required className="w-full resize-none rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#c84f03] to-[#e8930f] py-3 text-sm font-bold text-white shadow-lg shadow-[#c84f03]/25 hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
