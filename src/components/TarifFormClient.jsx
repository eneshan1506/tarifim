"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const defaultInitialForm = {
  title: "",
  summary: "",
  categorySlug: "",
  imageUrl: "",
  prepMinutes: "30",
  servings: "4",
  difficulty: "Kolay",
  ingredients: "",
  steps: "",
};

export default function TarifFormClient({ mode = "create", categories, initialForm, recipeId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...defaultInitialForm,
    categorySlug: categories[0]?.slug || "",
    ...initialForm,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialForm?.imageUrl || "");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isPending, startTransition] = useTransition();

  const isEditMode = mode === "edit";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : (initialForm?.imageUrl || ""));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    startTransition(async () => {
      try {
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          payload.append(key, value);
        });

        if (imageFile) {
          payload.append("image", imageFile);
        }

        const response = await fetch(isEditMode ? `/api/recipes/${recipeId}` : "/api/recipes", {
          method: isEditMode ? "PATCH" : "POST",
          body: payload,
        });

        const result = await response.json().catch(() => ({
          ok: false,
          message: `Tarif ${isEditMode ? "güncellenirken" : "oluşturulurken"} beklenmeyen bir hata oluştu.`,
        }));

        if (!response.ok || !result.ok) {
          setFeedback({
            type: "error",
            message: result.message || `Tarif ${isEditMode ? "güncellenemedi" : "oluşturulamadı"}.`,
          });
          return;
        }

        router.push(`/tarifler/${result.recipe.slug}`);
        router.refresh();
      } catch {
        setFeedback({
          type: "error",
          message: `Tarif ${isEditMode ? "güncellenirken" : "oluşturulurken"} ağ veya sunucu hatası oluştu.`,
        });
      }
    });
  };

  return (
    <SiteLayout>
      <section className="mb-6 animate-fade-in-up">
        <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#953700]">{isEditMode ? "Tarif Düzenle" : "Tarif Ekle"}</h1>
        <p className="mt-2 text-[#7f6248]">{isEditMode ? "Tarifinizi güncelleyin." : "Yeni bir tarif paylaşarak topluluğa katkı sağlayın."}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-[0_16px_36px_rgba(126,74,38,0.10)] ring-1 ring-[#f4e8db]/70 animate-fade-in-up delay-1">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Tarif Adı</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="summary" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Kısa Açıklama</label>
              <textarea id="summary" name="summary" rows={3} value={form.summary} onChange={handleChange} className="w-full resize-none rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>

            <div>
              <label htmlFor="categorySlug" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Kategori</label>
              <select id="categorySlug" name="categorySlug" value={form.categorySlug} onChange={handleChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03]">
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>{category.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Zorluk</label>
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03]">
                <option>Kolay</option>
                <option>Orta</option>
                <option>Zor</option>
              </select>
            </div>

            <div>
              <label htmlFor="prepMinutes" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Hazırlık Süresi</label>
              <input id="prepMinutes" name="prepMinutes" type="number" min="1" value={form.prepMinutes} onChange={handleChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>

            <div>
              <label htmlFor="servings" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Porsiyon</label>
              <input id="servings" name="servings" type="number" min="1" value={form.servings} onChange={handleChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Tarif Görseli</label>
              <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[#fff1dd] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#953700]" />
              <p className="mt-2 text-xs text-[#b89a7c]">JPG, PNG veya WebP. Maksimum 5 MB.</p>
              {imagePreview ? (
                <div className="mt-3 overflow-hidden rounded-2xl bg-[#fff8ef] p-3 ring-1 ring-[#f1dac3]/60">
                  <div className="relative h-48 overflow-hidden rounded-xl">
                    <Image src={imagePreview} alt="Tarif gorsel onizleme" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="ingredients" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Malzemeler</label>
              <textarea id="ingredients" name="ingredients" rows={8} value={form.ingredients} onChange={handleChange} className="w-full resize-none rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>

            <div>
              <label htmlFor="steps" className="mb-1 block text-xs font-semibold text-[#5f3d25]">Yapılış Adımları</label>
              <textarea id="steps" name="steps" rows={8} value={form.steps} onChange={handleChange} className="w-full resize-none rounded-xl border border-[#f1dac3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2318] outline-none focus:border-[#c84f03] focus:ring-2 focus:ring-[#c84f03]/20" />
            </div>
          </div>

          {feedback.message ? (
            <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${feedback.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
              {feedback.message}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-gradient-to-r from-[#c84f03] to-[#e8930f] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c84f03]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c84f03]/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (isEditMode ? "Kaydediliyor..." : "Oluşturuluyor...") : (isEditMode ? "Değişiklikleri Kaydet" : "Tarifi Paylaş")}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl bg-[#fff8ef] p-6 shadow-[0_12px_28px_rgba(126,74,38,0.08)] ring-1 ring-[#f4e8db]/70 animate-fade-in-up delay-2">
          <h2 className="font-[var(--font-display)] text-2xl font-bold text-[#953700]">İpucu</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5f3d25]">
            İlk sürümde malzeme ve adımları her satıra bir kayıt olacak şekilde giriyoruz. Bu yapı storage tarafında daha sade ve genişletmesi kolay.
          </p>
        </aside>
      </div>
    </SiteLayout>
  );
}
