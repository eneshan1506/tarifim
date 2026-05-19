"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import SiteLayout from "@/components/SiteLayout";

const initialForm = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export default function GirisClient() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isPending, startTransition] = useTransition();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setFeedback({ type: "", message: "" });
    setForm(initialForm);
    setShowPassword(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    startTransition(async () => {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            passwordConfirm: form.passwordConfirm,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({ ok: false, message: "İşlem sırasında beklenmeyen bir hata oluştu." }));

      if (!response.ok || !result.ok) {
        setFeedback({
          type: "error",
          message: result.message || "İşlem tamamlanamadı.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: mode === "login" ? "Giriş başarılı. Profilinize yönlendiriliyorsunuz..." : "Hesabınız oluşturuldu. Profilinize yönlendiriliyorsunuz...",
      });
      router.push("/profil");
      router.refresh();
    });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md py-4">
        <div className="mb-6 text-center animate-fade-in-up">
          <p className="mb-3 text-5xl">👨‍🍳</p>
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#953700]">
            {mode === "login" ? "Hoş Geldiniz" : "Aramıza Katılın"}
          </h1>
          <p className="mt-2 text-sm text-[#7f6248]">
            {mode === "login"
              ? "Hesabınıza giriş yaparak favorilerinize ve profilinize erişin."
              : "Ücretsiz hesap oluşturun, favorilerinizi kaydedin ve profilinizi yönetin."}
          </p>
        </div>

        <div className="mb-6 flex rounded-full bg-[#fffdf8] p-1 shadow-sm ring-1 ring-[#f1dac3]/60 animate-fade-in-up delay-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${mode === "login" ? "bg-[#c84f03] text-white shadow" : "text-[#7f6248] hover:text-[#2f2318]"}`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${mode === "register" ? "bg-[#c84f03] text-white shadow" : "text-[#7f6248] hover:text-[#2f2318]"}`}
          >
            Kayıt Ol
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_16px_36px_rgba(126,74,38,0.10)] ring-1 ring-[#f4e8db]/70 animate-fade-in-up delay-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="mb-1 block text-xs font-semibold text-[#5f3d25]">
                  Ad Soyad
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız"
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold text-[#5f3d25]">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold text-[#5f3d25]">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="En az 8 karakter, harf ve rakam"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 pr-10 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b89a7c] transition-colors hover:text-[#c84f03]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="passwordConfirm" className="mb-1 block text-xs font-semibold text-[#5f3d25]">
                  Şifre Tekrar
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none transition-all focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20 placeholder:text-[#b89a7c]"
                />
              </div>
            )}

            {mode === "login" ? (
              <p className="text-xs text-[#7f6248]">
                Hesabınıza giriş yaptığınızda profil ve favoriler sayfaları sizin oturumunuzla korunur.
              </p>
            ) : (
              <label htmlFor="terms" className="flex items-start gap-2 text-xs text-[#5f3d25]">
                <input id="terms" type="checkbox" checked readOnly className="mt-0.5 rounded accent-[#c84f03]" />
                <span>
                  <Link href="/kullanim-sartlari" className="text-[#c84f03] hover:underline">
                    Kullanım şartlarını
                  </Link>{" "}
                  ve{" "}
                  <Link href="/gizlilik" className="text-[#c84f03] hover:underline">
                    gizlilik politikasını
                  </Link>{" "}
                  kabul ederek devam edersiniz.
                </span>
              </label>
            )}

            {feedback.message ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${
                  feedback.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {feedback.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-[#c84f03] to-[#e8930f] py-3 text-sm font-bold text-white shadow-lg shadow-[#c84f03]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c84f03]/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "İşleniyor..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#b89a7c] animate-fade-in-up delay-3">
          {mode === "login" ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-[#c84f03] hover:underline"
          >
            {mode === "login" ? "Kayıt Olun" : "Giriş Yapın"}
          </button>
        </p>
      </div>
    </SiteLayout>
  );
}
