"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";

export default function GirisClient() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md py-4">
        {/* Dekoratif üst */}
        <div className="mb-6 text-center animate-fade-in-up">
          <p className="text-5xl mb-3">👨‍🍳</p>
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#953700]">
            {mode === "login" ? "Hoş Geldiniz" : "Aramıza Katılın"}
          </h1>
          <p className="mt-2 text-sm text-[#7f6248]">
            {mode === "login" ? "Hesabınıza giriş yaparak tarifleri keşfedin" : "Ücretsiz hesap oluşturun ve tarif paylaşmaya başlayın"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-full border border-[#f1dac3] bg-[#fffdf8] p-1 animate-fade-in-up delay-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${mode === "login" ? "bg-[#c84f03] text-white shadow" : "text-[#7f6248] hover:text-[#2f2318]"}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${mode === "register" ? "bg-[#c84f03] text-white shadow" : "text-[#7f6248] hover:text-[#2f2318]"}`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form kartı */}
        <div className="rounded-2xl border border-[#f1dac3] bg-white p-6 shadow-sm animate-fade-in-up delay-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {mode === "register" && (
              <div>
                <label htmlFor="fullname" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Ad Soyad</label>
                <input id="fullname" type="text" placeholder="Adınız Soyadınız" autoComplete="name" className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold text-[#5f3d25]">E-posta</label>
              <input id="email" type="email" placeholder="ornek@email.com" autoComplete="email" className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Şifre</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 pr-10 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b89a7c] hover:text-[#c84f03] transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="password-confirm" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Şifre Tekrar</label>
                <input id="password-confirm" type="password" placeholder="••••••••" autoComplete="new-password" className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]" />
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="remember" className="flex items-center gap-2 text-[#5f3d25] cursor-pointer">
                  <input id="remember" type="checkbox" className="rounded accent-[#c84f03]" /> Beni hatırla
                </label>
                <button type="button" className="text-[#c84f03] hover:underline font-medium">Şifremi unuttum</button>
              </div>
            )}

            {mode === "register" && (
              <label htmlFor="terms" className="flex items-start gap-2 text-xs text-[#5f3d25] cursor-pointer">
                <input id="terms" type="checkbox" className="mt-0.5 rounded accent-[#c84f03]" />
                <span><Link href="/kullanim-sartlari" className="text-[#c84f03] hover:underline">Kullanım şartlarını</Link> ve <Link href="/gizlilik" className="text-[#c84f03] hover:underline">gizlilik politikasını</Link> kabul ediyorum.</span>
              </label>
            )}

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#c84f03] to-[#e8930f] py-3 text-sm font-bold text-white shadow-lg shadow-[#c84f03]/25 transition-all hover:shadow-xl hover:shadow-[#c84f03]/30 hover:-translate-y-0.5 active:translate-y-0">
              {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>

          {/* Sosyal giriş */}
          <div className="mt-5">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#f1dac3]" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#b89a7c]">veya</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#f1dac3] bg-[#fffdf8] py-2.5 text-sm font-medium text-[#2f2318] transition-all hover:bg-[#fff5eb] hover:-translate-y-0.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#f1dac3] bg-[#fffdf8] py-2.5 text-sm font-medium text-[#2f2318] transition-all hover:bg-[#fff5eb] hover:-translate-y-0.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#b89a7c] animate-fade-in-up delay-3">
          {mode === "login" ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-[#c84f03] hover:underline">
            {mode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
          </button>
        </p>
      </div>
    </SiteLayout>
  );
}
