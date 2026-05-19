import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { deleteLocalImage, saveUploadedImage } from "@/lib/uploads";

function slugify(value) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parseLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const difficultyMap = {
  Kolay: "EASY",
  Orta: "MEDIUM",
  Zor: "HARD",
};

async function getOwnedRecipe(recipeId, userId) {
  if (!recipeId || !userId) {
    return null;
  }

  return prisma.recipe.findUnique({
    where: { id: recipeId },
    select: {
      id: true,
      slug: true,
      authorId: true,
    },
  }).then((recipe) => {
    if (!recipe || recipe.authorId !== userId) {
      return null;
    }

    return recipe;
  });
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  const { recipeId } = await params;

  if (!user) {
    return NextResponse.json({ ok: false, message: "Tarif düzenlemek için giriş yapın." }, { status: 401 });
  }

  const ownedRecipe = await getOwnedRecipe(recipeId, user.id);

  if (!ownedRecipe) {
    return NextResponse.json({ ok: false, message: "Tarif bulunamadı veya yetkiniz yok." }, { status: 404 });
  }

  const formData = await request.formData().catch(() => null);
  const title = String(formData?.get("title") || "").trim();
  const summary = String(formData?.get("summary") || "").trim();
  const categorySlug = String(formData?.get("categorySlug") || "").trim();
  const prepMinutes = Number.parseInt(formData?.get("prepMinutes"), 10);
  const servings = Number.parseInt(formData?.get("servings"), 10);
  const difficulty = difficultyMap[String(formData?.get("difficulty") || "")] || "EASY";
  const ingredients = parseLines(formData?.get("ingredients"));
  const steps = parseLines(formData?.get("steps"));
  const imageFile = formData?.get("image");

  if (title.length < 3 || summary.length < 10 || !categorySlug || !Number.isInteger(prepMinutes) || prepMinutes <= 0 || !Number.isInteger(servings) || servings <= 0 || ingredients.length === 0 || steps.length === 0) {
    return NextResponse.json({ ok: false, message: "Form alanlarını geçerli şekilde doldurun." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });

  if (!category) {
    return NextResponse.json({ ok: false, message: "Kategori bulunamadı." }, { status: 404 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.recipe.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === ownedRecipe.id) {
      break;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  let uploadedImageUrl = null;

  try {
    uploadedImageUrl = await saveUploadedImage(imageFile);

    const result = await prisma.$transaction(async (tx) => {
      const currentRecipe = await tx.recipe.findUnique({
        where: { id: ownedRecipe.id },
        select: {
          id: true,
          slug: true,
          imageUrl: true,
        },
      });

      await tx.recipe.update({
        where: { id: ownedRecipe.id },
        data: {
          title,
          slug,
          summary,
          imageUrl: uploadedImageUrl || currentRecipe?.imageUrl || null,
          prepMinutes,
          servings,
          difficulty,
          categoryId: category.id,
        },
      });

      await tx.recipeIngredient.deleteMany({
        where: { recipeId: ownedRecipe.id },
      });

      await tx.recipeStep.deleteMany({
        where: { recipeId: ownedRecipe.id },
      });

      await tx.recipeIngredient.createMany({
        data: ingredients.map((name, index) => ({
          recipeId: ownedRecipe.id,
          name,
          sortOrder: index,
        })),
      });

      await tx.recipeStep.createMany({
        data: steps.map((bodyText, index) => ({
          recipeId: ownedRecipe.id,
          body: bodyText,
          sortOrder: index,
        })),
      });

      const recipe = await tx.recipe.findUnique({
        where: { id: ownedRecipe.id },
        select: {
          id: true,
          slug: true,
          imageUrl: true,
        },
      });

      return {
        previousImageUrl: currentRecipe?.imageUrl || null,
        recipe,
      };
    });

    if (uploadedImageUrl && result.previousImageUrl && result.previousImageUrl !== uploadedImageUrl) {
      await deleteLocalImage(result.previousImageUrl);
    }

    revalidatePath("/");
    revalidatePath("/tarifler");
    revalidatePath("/yeni-eklenenler");
    revalidatePath("/profil");
    revalidatePath(`/tarifler/${ownedRecipe.slug}`);
    revalidatePath(`/tarifler/${result.recipe.slug}`);

    return NextResponse.json({ ok: true, recipe: result.recipe });
  } catch (error) {
    if (uploadedImageUrl) {
      await deleteLocalImage(uploadedImageUrl);
    }

    if (error instanceof Error && error.message === "INVALID_FILE_TYPE") {
      return NextResponse.json({ ok: false, message: "Yalnizca gorsel dosyasi yukleyebilirsiniz." }, { status: 400 });
    }

    if (error instanceof Error && error.message === "FILE_TOO_LARGE") {
      return NextResponse.json({ ok: false, message: "Gorsel boyutu 5 MB'dan buyuk olamaz." }, { status: 400 });
    }

    return NextResponse.json({ ok: false, message: "Tarif güncellenirken sunucu hatası oluştu." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUser();
  const { recipeId } = await params;

  if (!user) {
    return NextResponse.json({ ok: false, message: "Tarif silmek için giriş yapın." }, { status: 401 });
  }

  const ownedRecipe = await getOwnedRecipe(recipeId, user.id);

  if (!ownedRecipe) {
    return NextResponse.json({ ok: false, message: "Tarif bulunamadı veya yetkiniz yok." }, { status: 404 });
  }

  try {
    const recipeToDelete = await prisma.recipe.findUnique({
      where: { id: ownedRecipe.id },
      select: {
        imageUrl: true,
      },
    });

    await prisma.recipe.delete({
      where: { id: ownedRecipe.id },
    });

    if (recipeToDelete?.imageUrl) {
      await deleteLocalImage(recipeToDelete.imageUrl);
    }

    revalidatePath("/");
    revalidatePath("/tarifler");
    revalidatePath("/yeni-eklenenler");
    revalidatePath("/profil");
    revalidatePath(`/tarifler/${ownedRecipe.slug}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Tarif silinirken sunucu hatası oluştu." }, { status: 500 });
  }
}
