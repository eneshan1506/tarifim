import KategorilerClient from "./KategorilerClient";

export const metadata = {
  title: "Kategoriler — Tarifim",
  description: "Tüm yemek kategorilerini keşfedin. Ana yemek, çorba, tatlı, salata ve daha fazlası.",
};

export default function KategorilerPage() {
  return <KategorilerClient />;
}
