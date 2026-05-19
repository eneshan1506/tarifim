import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(_request, { params }) {
  const user = await getCurrentUser();
  const { recipeId } = await params;

  if (!user) {
    return NextResponse.json({ ok: false, message: "Favori eklemek için giriş yapın." }, { status: 401 });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { id: true },
  });

  if (!recipe) {
    return NextResponse.json({ ok: false, message: "Tarif bulunamadı." }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      recipeId,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();
  const { recipeId } = await params;

  if (!user) {
    return NextResponse.json({ ok: false, message: "Oturum bulunamadı." }, { status: 401 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      recipeId,
    },
  });

  return NextResponse.json({ ok: true });
}
