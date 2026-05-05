import SiteLayout from "@/components/SiteLayout";

// Henüz tamamlanmayan route'lar için ortak geçici sayfa şablonu.
export default function PlaceholderPage({ title, description }) {
  return (
    <SiteLayout>
      {/* Başlık ve kısa açıklama kartı */}
      <section className="rounded-2xl border border-[#f1dac3] bg-white p-6 shadow-[0_12px_28px_rgba(126,74,38,0.12)]">
        <h1 className="font-[var(--font-display)] text-4xl font-semibold text-[#953700]">{title}</h1>
        <p className="mt-3 max-w-3xl text-[#6f5440]">{description}</p>
      </section>
    </SiteLayout>
  );
}
