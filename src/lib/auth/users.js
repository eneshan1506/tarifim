import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth/validation";

export async function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  return prisma.user.findUnique({
    where: {
      email: normalized,
    },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser({ name, email, passwordHash }) {
  const normalized = normalizeEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalized,
    },
  });

  if (existingUser) {
    return { ok: false, message: "Bu e-posta ile kayıtlı bir hesap zaten var." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: normalized,
      passwordHash,
      bio: "Tariflerini keşfetmeye ve paylaşmaya hazır.",
    },
  });

  return { ok: true, user };
}
