import { createHash, randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RecipeDifficulty, RecipeStatus, UserRole } from "@prisma/client";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || process.env[key]) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  { slug: "ana-yemek", emoji: "🍖", name: "Ana Yemek", color: "#fee2e2", accent: "#dc2626", description: "Sofranın baş tacı, doyurucu ana yemek tarifleri" },
  { slug: "corba", emoji: "🥣", name: "Çorbalar", color: "#fef3c7", accent: "#d97706", description: "Sıcacık, şifalı çorba tarifleri" },
  { slug: "salata", emoji: "🥗", name: "Salatalar", color: "#d1fae5", accent: "#059669", description: "Hafif ve sağlıklı salata çeşitleri" },
  { slug: "tatli", emoji: "🍰", name: "Tatlılar", color: "#fce7f3", accent: "#db2777", description: "Ağızda dağılan tatlı tarifleri" },
  { slug: "kahvalti", emoji: "🥞", name: "Kahvaltılık", color: "#fff7ed", accent: "#ea580c", description: "Güne güzel başlatan kahvaltılıklar" },
  { slug: "icecek", emoji: "🍹", name: "İçecekler", color: "#ede9fe", accent: "#7c3aed", description: "Serinleten ve ferahlatan içecek tarifleri" },
  { slug: "hamur-isi", emoji: "🥐", name: "Hamur İşleri", color: "#fef9c3", accent: "#ca8a04", description: "Börek, poğaça, ekmek ve pasta tarifleri" },
  { slug: "aperatif", emoji: "🧆", name: "Aperatifler", color: "#ffedd5", accent: "#c2410c", description: "Misafirlere özel atıştırmalık ve mezeler" },
  { slug: "deniz-urunleri", emoji: "🐟", name: "Deniz Ürünleri", color: "#e0f2fe", accent: "#0284c7", description: "Taze balık ve deniz mahsulleri tarifleri" },
  { slug: "vegan", emoji: "🌱", name: "Vegan", color: "#ecfccb", accent: "#65a30d", description: "Bitkisel bazlı sağlıklı tarifler" },
  { slug: "bebek", emoji: "👶", name: "Bebek Mamaları", color: "#fdf2f8", accent: "#c026d3", description: "Minikler için besleyici mama tarifleri" },
  { slug: "dunya-mutfagi", emoji: "🌍", name: "Dünya Mutfağı", color: "#f0fdf4", accent: "#16a34a", description: "İtalyan, Meksika, Uzak Doğu ve daha fazlası" },
];

const recipes = [
  { title: "Fırında Kağıt Kebabı", slug: "firinda-kagit-kebabi", category: "ana-yemek", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80", prepMinutes: 65, difficulty: RecipeDifficulty.MEDIUM, author: "Ayşe K.", summary: "Yumuşacık et parçaları, sebzeler ve baharatlarla fırında pişen nefis kağıt kebabı tarifi." },
  { title: "Mercimek Çorbası", slug: "mercimek-corbasi", category: "corba", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80", prepMinutes: 35, difficulty: RecipeDifficulty.EASY, author: "Fatma Y.", summary: "Klasik Türk mutfağının vazgeçilmez lezzeti, kremamsı mercimek çorbası." },
  { title: "San Sebastian Cheesecake", slug: "san-sebastian-cheesecake", category: "tatli", imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80", prepMinutes: 50, difficulty: RecipeDifficulty.MEDIUM, author: "Zeynep A.", summary: "Üstü karamelize, içi kremamsı efsane cheesecake tarifi." },
  { title: "Karnıyarık", slug: "karniyarik", category: "ana-yemek", imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80", prepMinutes: 55, difficulty: RecipeDifficulty.MEDIUM, author: "Mehmet D.", summary: "Kızartılmış patlıcanlar üzerine kıymalı harç ile hazırlanan klasik lezzet." },
  { title: "Çıtır Börek", slug: "citir-borek", category: "hamur-isi", imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80", prepMinutes: 40, difficulty: RecipeDifficulty.EASY, author: "Hatice T.", summary: "Yufka ile hazırlanan peynirli çıtır çıtır börek tarifi." },
  { title: "Atom Salata", slug: "atom-salata", category: "salata", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", prepMinutes: 15, difficulty: RecipeDifficulty.EASY, author: "Selin M.", summary: "Acılı, ekşili, bol malzemeli atom salata tarifi." },
  { title: "Tavuk Sote", slug: "tavuk-sote", category: "ana-yemek", imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80", prepMinutes: 45, difficulty: RecipeDifficulty.EASY, author: "Ali R.", summary: "Sebzeli, soslu nefis tavuk sote tarifi." },
  { title: "Künefe", slug: "kunefe", category: "tatli", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80", prepMinutes: 30, difficulty: RecipeDifficulty.HARD, author: "Hasan B.", summary: "Peynirli, şerbetli, çıtır çıtır geleneksel künefe." },
  { title: "Ezogelin Çorbası", slug: "ezogelin-corbasi", category: "corba", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", prepMinutes: 40, difficulty: RecipeDifficulty.EASY, author: "Elif S.", summary: "Bulgur ve mercimekle yapılan geleneksel Türk çorbası." },
  { title: "Falafel", slug: "falafel", category: "vegan", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", prepMinutes: 25, difficulty: RecipeDifficulty.MEDIUM, author: "Derya K.", summary: "Nohuttan yapılan çıtır dışı yumuşak içi vegan köfte." },
  { title: "Limonata", slug: "limonata", category: "icecek", imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80", prepMinutes: 10, difficulty: RecipeDifficulty.EASY, author: "Burcu N.", summary: "Ev yapımı ferahlatıcı naneli limonata." },
  { title: "Menemen", slug: "menemen", category: "kahvalti", imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80", prepMinutes: 20, difficulty: RecipeDifficulty.EASY, author: "Kemal Ö.", summary: "Domatesli, biberli, yumurtalı klasik Türk kahvaltısı." },
];

const sampleIngredients = [
  { name: "Soğan", amount: 2, unit: "adet" },
  { name: "Domates", amount: 3, unit: "adet" },
  { name: "Zeytinyağı", amount: 3, unit: "yemek kaşığı" },
  { name: "Tuz", amount: 1, unit: "tatlı kaşığı" },
  { name: "Karabiber", amount: 1, unit: "çay kaşığı" },
];

const sampleSteps = [
  "Malzemeleri hazırlayın ve ölçüleri ayarlayın.",
  "Tencereyi veya tavayı orta ateşte ısıtın ve yağı ekleyin.",
  "Ana malzemeleri sırayla ekleyip karıştırarak pişirin.",
  "Baharatları ekleyin ve lezzeti dengeleyin.",
  "Tarifi sıcak şekilde servis edin.",
];

const sampleComments = [
  "Harika bir tarif, tekrar yapacağım.",
  "Evde denedim, sonuç çok başarılı oldu.",
  "Anlatımı net, lezzeti de çok iyi.",
];

function slugToEmail(name) {
  const normalized = name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return `${normalized}@tarifim.local`;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

function stableDayOffset(seed) {
  const hash = createHash("sha1").update(seed).digest("hex");
  return Number.parseInt(hash.slice(0, 2), 16) % 30;
}

async function main() {
  console.log("Seeding database...");

  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.recipeStep.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories = new Map();

  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        emoji: category.emoji,
        color: category.color,
        accent: category.accent,
      },
    });

    createdCategories.set(category.slug, created);
  }

  const uniqueAuthors = [...new Set(recipes.map((recipe) => recipe.author))];
  const createdAuthors = new Map();

  for (const authorName of uniqueAuthors) {
    const created = await prisma.user.create({
      data: {
        name: authorName,
        email: slugToEmail(authorName),
        passwordHash: hashPassword("Tarif1234"),
        role: UserRole.USER,
        bio: "Tariflerini paylaşan örnek kullanıcı.",
      },
    });

    createdAuthors.set(authorName, created);
  }

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Kullanıcı",
      email: "demo@tarifim.local",
      passwordHash: hashPassword("Demo1234"),
      role: UserRole.ADMIN,
      bio: "Seed ile oluşturulan yönetici/demo kullanıcı.",
    },
  });

  const createdRecipes = [];

  for (const recipe of recipes) {
    const created = await prisma.recipe.create({
      data: {
        title: recipe.title,
        slug: recipe.slug,
        summary: recipe.summary,
        imageUrl: recipe.imageUrl,
        prepMinutes: recipe.prepMinutes,
        servings: 4,
        difficulty: recipe.difficulty,
        status: RecipeStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - stableDayOffset(recipe.slug) * 24 * 60 * 60 * 1000),
        authorId: createdAuthors.get(recipe.author).id,
        categoryId: createdCategories.get(recipe.category).id,
        ingredients: {
          create: sampleIngredients.map((ingredient, index) => ({
            ...ingredient,
            sortOrder: index,
          })),
        },
        steps: {
          create: sampleSteps.map((body, index) => ({
            body,
            sortOrder: index,
          })),
        },
      },
    });

    createdRecipes.push(created);
  }

  for (const [index, recipe] of createdRecipes.entries()) {
    const commentAuthor = index % 2 === 0 ? demoUser : createdAuthors.get(recipes[index].author);

    await prisma.comment.create({
      data: {
        body: sampleComments[index % sampleComments.length],
        recipeId: recipe.id,
        userId: commentAuthor.id,
      },
    });

    await prisma.favorite.create({
      data: {
        recipeId: recipe.id,
        userId: demoUser.id,
      },
    });
  }

  console.log(`Seed completed: ${createdCategories.size} categories, ${createdAuthors.size + 1} users, ${createdRecipes.length} recipes.`);
  console.log("Demo login for future DB auth migration: demo@tarifim.local / Demo1234");
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
