import { Suspense } from "react";
import TariflerClient from "./TariflerClient";

export const metadata = {
  title: "Tarifler — Tarifim",
  description: "Tüm tarifleri keşfedin. Filtreleme, sıralama ve kategoriye göre arama yapın.",
};

export default function TariflerPage() {
  return (
    <Suspense>
      <TariflerClient />
    </Suspense>
  );
}
