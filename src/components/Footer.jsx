"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Footer link grupları ─── */
const categoryLinks = [
  { label: "Ana Yemek", href: "/kategoriler?grup=ana-yemek" },
  { label: "Çorbalar", href: "/kategoriler?grup=corba" },
  { label: "Salatalar", href: "/kategoriler?grup=salata" },
  { label: "Tatlılar", href: "/kategoriler?grup=tatli" },
  { label: "Kahvaltı", href: "/kategoriler?grup=kahvalti" },
  { label: "İçecekler", href: "/kategoriler?grup=icecek" },
];

const quickLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Sık Sorulan Sorular", href: "/sss" },
  { label: "Gizlilik Politikası", href: "/gizlilik" },
  { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
];

/* ─── Sosyal medya ikonları ─── */
const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-6 overflow-hidden rounded-2xl bg-[#2f2318] shadow-[0_-8px_32px_rgba(47,35,24,0.15)]">
      {/* Üst dekoratif çizgi */}
      <div className="h-1 w-full bg-gradient-to-r from-[#c84f03] via-[#e8930f] to-[#c84f03]" />

      <div className="grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* ─── Sütun 1: Marka ─── */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-[var(--font-display)] text-3xl font-extrabold text-[#f0a060]">
            Tarifim
          </Link>
          <p className="text-sm leading-relaxed text-[#b89a7c]">
            Türkiye'nin en lezzetli tarif platformu. Binlerce tarif keşfet, kendi tariflerini paylaş ve mutfakta yeni maceralar yaşa!
          </p>
          {/* Sosyal medya */}
          <div className="flex items-center gap-3 pt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4a3828] text-[#b89a7c] transition-all duration-200 hover:border-[#f0a060] hover:bg-[#f0a060]/10 hover:text-[#f0a060]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ─── Sütun 2: Kategoriler ─── */}
        <div>
          <h3 className="mb-4 font-[var(--font-display)] text-lg font-bold text-white">
            Kategoriler
          </h3>
          <ul className="grid gap-2">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="footer-link text-sm text-[#b89a7c]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Sütun 3: Hızlı Bağlantılar ─── */}
        <div>
          <h3 className="mb-4 font-[var(--font-display)] text-lg font-bold text-white">
            Hızlı Bağlantılar
          </h3>
          <ul className="grid gap-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="footer-link text-sm text-[#b89a7c]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Sütun 4: Bülten ─── */}
        <div>
          <h3 className="mb-4 font-[var(--font-display)] text-lg font-bold text-white">
            Bülten
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-[#b89a7c]">
            Yeni tariflerden ve kampanyalardan haberdar olmak için bültenimize abone olun.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              className="newsletter-input w-full rounded-lg border border-[#4a3828] bg-[#3d2e20] px-4 py-2.5 text-sm text-white placeholder:text-[#8a7060] transition-colors focus:border-[#f0a060]"
            />
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-[#c84f03] to-[#e8930f] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {subscribed ? "✓ Abone Oldunuz!" : "Abone Ol"}
            </button>
          </form>
        </div>
      </div>

      {/* ─── Alt bar ─── */}
      <div className="border-t border-[#4a3828] px-6 py-4 sm:px-10">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-[#8a7060] sm:flex-row">
          <p>© 2026 Tarifim. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-400">❤</span>
            <span>in Türkiye</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
