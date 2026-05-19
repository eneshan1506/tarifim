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

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "Tarif eklemek için giriş yapın." }, { status: 401 });
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

  if (title.length < 3) {
    return NextResponse.json({ ok: false, message: "Tarif adı en az 3 karakter olmalıdır." }, { status: 400 });
  }

  if (summary.length < 10) {
    return NextResponse.json({ ok: false, message: "Tarif açıklaması en az 10 karakter olmalıdır." }, { status: 400 });
  }

  if (!categorySlug) {
    return NextResponse.json({ ok: false, message: "Kategori seçimi zorunludur." }, { status: 400 });
  }

  if (!Number.isInteger(prepMinutes) || prepMinutes <= 0) {
    return NextResponse.json({ ok: false, message: "Hazırlık süresi geçerli olmalıdır." }, { status: 400 });
  }

  if (!Number.isInteger(servings) || servings <= 0) {
    return NextResponse.json({ ok: false, message: "Porsiyon bilgisi geçerli olmalıdır." }, { status: 400 });
  }

  if (ingredients.length === 0 || steps.length === 0) {
    return NextResponse.json({ ok: false, message: "En az bir malzeme ve bir adım girilmelidir." }, { status: 400 });
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

  while (await prisma.recipe.findUnique({ where: { slug }, select: { id: true } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  let uploadedImageUrl = null;

  try {
    uploadedImageUrl = await saveUploadedImage(imageFile);

    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        summary,
        imageUrl: uploadedImageUrl,
        prepMinutes,
        servings,
        difficulty,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: category.id,
        ingredients: {
          create: ingredients.map((name, index) => ({
            name,
            sortOrder: index,
          })),
        },
        steps: {
          create: steps.map((bodyText, index) => ({
            body: bodyText,
            sortOrder: index,
          })),
        },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/tarifler");
    revalidatePath("/yeni-eklenenler");
    revalidatePath("/profil");

    return NextResponse.json({ ok: true, recipe });
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

    return NextResponse.json({ ok: false, message: "Tarif oluşturulurken sunucu hatası oluştu." }, { status: 500 });
  }
}
