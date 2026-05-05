import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

// Uygulama genelinde kullanılacak ana yazı tipi (metinler için).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Başlık ve vurgu alanlarında kullanılacak display yazı tipi.
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

// Tüm sayfalarda geçerli olacak temel metadata bilgileri.
export const metadata = {
  title: "Tarifim",
  description: "Tarif platformu frontend",
};

// Root layout: tüm sayfaları ortak font ve global stil ile sarar.
export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${geist.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
