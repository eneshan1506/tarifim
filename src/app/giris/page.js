import GirisClient from "./GirisClient";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Giriş Yap — Tarifim",
  description: "Tarifim hesabınıza giriş yapın veya yeni bir hesap oluşturun.",
};

export default async function GirisPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/profil");
  }

  return <GirisClient />;
}
