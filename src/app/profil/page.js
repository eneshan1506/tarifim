import ProfilClient from "./ProfilClient";
import { requireUser } from "@/lib/auth/server";
import { getProfileData } from "@/lib/content";

export const metadata = { title: "Profilim — Tarifim", description: "Profilinizi görüntüleyin ve yönetin." };

export default async function ProfilPage() {
  const user = await requireUser();
  const profile = await getProfileData(user.id);

  return <ProfilClient profile={profile} />;
}
