import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Ortak site yerleşimi: üstte sabit navbar, ortada içerik, altta footer.
export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_0%_0%,rgba(232,93,4,0.12),transparent_25%),radial-gradient(circle_at_100%_10%,rgba(255,171,80,0.16),transparent_28%),#fff8ef] px-2 py-4 text-[#2f2318] sm:px-3">
      {/* Tüm sayfalarda görünen sabit üst menü */}
      <Navbar />

      {/* Sayfaya özel içerikler bu alanda render edilir */}
      <main id="main-content" className="grid w-full flex-1 gap-5 pt-28">
        {children}
      </main>

      {/* Zenginleştirilmiş footer */}
      <Footer />
    </div>
  );
}
