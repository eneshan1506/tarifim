"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

// Navbar üstündeki dil seçenekleri (ileride i18n altyapısına bağlanabilir).
const languageOptions = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
];

// Açılır ana menü grupları ve alt linkleri.
const menuGroups = [
  {
    label: "Anasayfa",
    href: "/",
    items: [],
  },
  {
    label: "Tarifler",
    items: [
      { href: "/tarifler", label: "Tüm Tarifler" },
      { href: "/tarifler?tip=hizli", label: "Hızlı Tarifler" },
    ],
  },
  {
    label: "Kategoriler",
    items: [
      { href: "/kategoriler", label: "Kategori Listesi" },
      { href: "/kategoriler?grup=ana-yemek", label: "Ana Yemek" },
      { href: "/kategoriler?grup=tatli", label: "Tatlı" },
    ],
  },
  {
    label: "İletişim",
    items: [
      { href: "/iletisim", label: "Bize Ulaşın" },
      { href: "/sss", label: "Sık Sorulan Sorular" },
    ],
  },
];

export default function Navbar() {
  // Route değişimlerini izlemek için pathname alınır.
  const pathname = usePathname();
  const router = useRouter();
  // Mobil menünün açık/kapalı durumunu tutar.
  const [mobileOpen, setMobileOpen] = useState(false);
  // Mobil accordion içinde açık olan grup etiketi.
  const [openGroup, setOpenGroup] = useState("");
  // Desktop'ta hover ile açık görünen grup etiketi.
  const [desktopOpenGroup, setDesktopOpenGroup] = useState("");
  // Desktop'ta kullanıcı menüsünün açık/kapalı durumunu tutar.
  const [desktopUserOpen, setDesktopUserOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isLoggingOut, startLogoutTransition] = useTransition();

  // Mobilde bir menü grubunu aç/kapat.
  const toggleGroup = (label) => {
    setOpenGroup((prev) => (prev === label ? "" : label));
  };

  // Mobil menü içinden bir linke tıklanınca paneli kapat.
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Sayfa değiştiğinde tüm açık menüleri kapat (takılı kalma sorununu önler).
  useEffect(() => {
    const resetMenus = window.setTimeout(() => {
      setMobileOpen(false);
      setOpenGroup("");
      setDesktopOpenGroup("");
      setDesktopUserOpen(false);
    }, 0);

    return () => window.clearTimeout(resetMenus);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const syncAuthState = async () => {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json().catch(() => null);

      if (!cancelled) {
        setAuthUser(result?.user || null);
      }
    };

    syncAuthState();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const userInitial = authUser?.name?.charAt(0)?.toUpperCase() || "Ü";

  const handleLogout = () => {
    startLogoutTransition(async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        return;
      }

      setAuthUser(null);
      router.push("/giris");
      router.refresh();
    });
  };

  return (
    <header className="fixed left-2 right-2 top-3 z-50 rounded-2xl bg-white/92 px-3 py-3 shadow-[0_18px_40px_rgba(126,74,38,0.14)] backdrop-blur sm:left-3 sm:right-3">
      {/* Skip-to-content (klavye/ekran okuyucu erişilebilirliği) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#c84f03] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        İçeriğe atla
      </a>

      <div className="flex items-center justify-between gap-3">
        {/* Sol tarafta marka logosu */}
        <Link href="/" className="font-[var(--font-display)] text-3xl font-extrabold text-[#953700]">
          Tarifim
        </Link>

        {/* Desktop ana menü (hover ile açılan dropdown yapısı) */}
        <nav className="hidden flex-wrap items-center justify-center gap-3 lg:flex" aria-label="Ana menü">
          {menuGroups.map((group) => {
            if (group.href) {
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  onClick={() => {
                    setDesktopOpenGroup("");
                    setDesktopUserOpen(false);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    isActive(group.href)
                      ? "border-[#c84f03] bg-[#fff5eb] text-[#c84f03]"
                      : "border-transparent bg-white/70 text-[#5f3d25] shadow-sm hover:bg-white"
                  }`}
                >
                  {group.label}
                </Link>
              );
            }

            const isGroupActive = group.items.some((item) => isActive(item.href));
            const isOpen = desktopOpenGroup === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => { setDesktopUserOpen(false); setDesktopOpenGroup(group.label); }}
                onMouseLeave={() => setDesktopOpenGroup("")}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    isGroupActive
                      ? "border-[#c84f03] bg-[#fff5eb] text-[#c84f03]"
                      : "border-transparent bg-white/70 text-[#5f3d25] shadow-sm hover:bg-white"
                  }`}
                >
                  {group.label}
                </button>
                <div
                  className={`absolute left-0 top-full mt-1 min-w-[210px] overflow-hidden rounded-xl bg-white shadow-[0_14px_30px_rgba(126,74,38,0.14)] ring-1 ring-black/5 transition-all ${
                    isOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1"
                  }`}
                >
                  {group.items.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      onClick={() => { setDesktopOpenGroup(""); setDesktopUserOpen(false); }}
                      className={`block border-b border-[#f7e5d5] px-3 py-2 text-sm last:border-b-0 transition-colors ${
                        isActive(item.href)
                          ? "bg-[#fff5eb] font-semibold text-[#c84f03]"
                          : "text-[#5f3d25] hover:bg-[#fff5eb]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop sağ aksiyon alanı: Tarif Ekle + dil seçimi + üye menüsü */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Tarif Ekle CTA */}
          <Link
            href="/tarif-ekle"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#c84f03] to-[#e8930f] px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Tarif Ekle
          </Link>
          <select
            aria-label="Dil seçimi"
            defaultValue="tr"
            className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#5f3d25] shadow-sm outline-none ring-1 ring-[#f1dac3]/60"
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>

          <div
            className="relative"
            onMouseEnter={() => { setDesktopOpenGroup(""); setDesktopUserOpen(true); }}
            onMouseLeave={() => setDesktopUserOpen(false)}
          >
            <button
              type="button"
              aria-expanded={desktopUserOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#7f3100] shadow-sm ring-1 ring-[#f1dac3]/55 transition-colors hover:bg-[#fffaf4]"
            >
              {authUser ? (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#c84f03] to-[#e8930f] text-xs text-white">
                    {userInitial}
                  </span>
                  <span>{authUser.name.split(" ")[0]}</span>
                </>
              ) : (
                "Üye"
              )}
            </button>
            <div
              className={`absolute right-0 top-full min-w-[170px] overflow-hidden rounded-xl bg-white shadow-[0_14px_30px_rgba(126,74,38,0.14)] ring-1 ring-black/5 ${
                desktopUserOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              {authUser ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => {
                      setDesktopOpenGroup("");
                      setDesktopUserOpen(false);
                    }}
                    className="block border-b border-[#f7e5d5] px-3 py-2 text-sm hover:bg-[#fff5eb]"
                  >
                    Profilim
                  </Link>
                  <Link
                    href="/favoriler"
                    onClick={() => {
                      setDesktopOpenGroup("");
                      setDesktopUserOpen(false);
                    }}
                    className="block border-b border-[#f7e5d5] px-3 py-2 text-sm hover:bg-[#fff5eb]"
                  >
                    Favorilerim
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[#fff5eb] disabled:cursor-not-allowed disabled:text-[#b89a7c]"
                  >
                    {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
                  </button>
                </>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => {
                    setDesktopOpenGroup("");
                    setDesktopUserOpen(false);
                  }}
                  className="block px-3 py-2 text-sm hover:bg-[#fff5eb]"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobil hamburger butonu */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menüyü aç/kapat"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7f3100] shadow-sm ring-1 ring-[#f1dac3]/60 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            {mobileOpen ? (
              <path d="M6 6L18 18M18 6L6 18" />
            ) : (
              <path d="M4 7H20M4 12H20M4 17H20" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobil menü paneli: hamburger açılınca accordion olarak görünür */}
      {mobileOpen && (
        <div className="mt-3 grid gap-3 border-t border-[#f7e5d5]/70 pt-3 lg:hidden">
          {/* Mobil menü link grupları */}
          <nav className="grid gap-2" aria-label="Mobil ana menü">
            {menuGroups.map((group) => {
              if (group.href) {
                return (
                  <Link
                    key={group.label}
                    href={group.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-[#5f3d25] shadow-sm ring-1 ring-[#f1dac3]/55"
                  >
                    {group.label}
                  </Link>
                );
              }

              const isOpen = openGroup === group.label;
              return (
                <div key={group.label} className="overflow-hidden rounded-xl bg-[#fffdf8] shadow-sm ring-1 ring-[#f1dac3]/55">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-[#5f3d25]"
                  >
                    <span>{group.label}</span>
                    <span>{isOpen ? "-" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#f7e5d5]/70 bg-white">
                      {group.items.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="block border-b border-[#f7e5d5] px-3 py-2 text-sm text-[#5f3d25] last:border-b-0"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobil alt aksiyonlar: dil seçimi ve üye girişi */}
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Dil seçimi"
              defaultValue="tr"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#5f3d25] shadow-sm outline-none ring-1 ring-[#f1dac3]/60"
            >
              {languageOptions.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>

            {authUser ? (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="rounded-xl bg-[#fffdf8] px-3 py-2 text-center text-sm font-bold text-[#7f3100] shadow-sm ring-1 ring-[#f1dac3]/55 disabled:text-[#b89a7c]"
              >
                {isLoggingOut ? "Çıkılıyor..." : "Çıkış Yap"}
              </button>
            ) : (
              <Link
                href="/giris"
                onClick={closeMobileMenu}
                className="rounded-xl bg-[#fffdf8] px-3 py-2 text-center text-sm font-bold text-[#7f3100] shadow-sm ring-1 ring-[#f1dac3]/55"
              >
                Üye Girişi
              </Link>
            )}
          </div>

          {authUser ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/profil"
                onClick={closeMobileMenu}
                className="rounded-xl bg-[#fff5eb] px-3 py-2 text-center text-sm font-semibold text-[#7f3100]"
              >
                Profilim
              </Link>
              <Link
                href="/favoriler"
                onClick={closeMobileMenu}
                className="rounded-xl bg-[#fff5eb] px-3 py-2 text-center text-sm font-semibold text-[#7f3100]"
              >
                Favorilerim
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}
