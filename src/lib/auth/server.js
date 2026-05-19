import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { findUserById } from "@/lib/auth/users";
import { verifySessionToken } from "@/lib/auth/session";

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await findUserById(session.sub);

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/giris");
  }

  return user;
}
