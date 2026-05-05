import TarifDetayClient from "./TarifDetayClient";

export function generateMetadata({ params }) {
  return {
    title: "Tarif Detay — Tarifim",
    description: "Tarif detayları, malzemeler ve yapılış adımları.",
  };
}

export default function TarifDetayPage({ params }) {
  return <TarifDetayClient slug={params.slug} />;
}
