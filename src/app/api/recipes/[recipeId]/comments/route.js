import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "Yorum yapmak için giriş yapın." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const commentBody = String(body?.body || "").trim();

  if (commentBody.length < 2) {
    return NextResponse.json({ ok: false, message: "Yorum en az 2 karakter olmalıdır." }, { status: 400 });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: params.recipeId },
    select: { id: true },
  });

  if (!recipe) {
    return NextResponse.json({ ok: false, message: "Tarif bulunamadı." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: commentBody,
      recipeId: params.recipeId,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    comment: {
      id: comment.id,
      author: comment.user.name,
      text: comment.body,
      date: "Bugün",
      likes: 0,
    },
  });
}
