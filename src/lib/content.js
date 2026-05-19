import { prisma } from "@/lib/prisma";

const AUTHOR_COLORS = [
  "#e8930f",
  "#059669",
  "#db2777",
  "#c84f03",
  "#2563eb",
  "#7c3aed",
  "#65a30d",
  "#ea580c",
];

const difficultyLabels = {
  EASY: "Kolay",
  MEDIUM: "Orta",
  HARD: "Zor",
};

const difficultyColors = {
  EASY: "#22c55e",
  MEDIUM: "#f59e0b",
  HARD: "#ef4444",
};

function pickAuthorColor(seed) {
  const total = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AUTHOR_COLORS[total % AUTHOR_COLORS.length];
}

function mapRecipe(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    category: recipe.category.slug,
    categoryLabel: recipe.category.name,
    categoryEmoji: recipe.category.emoji || "🍽️",
    image: recipe.imageUrl,
    time: recipe.prepMinutes ?? 0,
    difficulty: difficultyLabels[recipe.difficulty] || "Kolay",
    dColor: difficultyColors[recipe.difficulty] || "#22c55e",
    likes: recipe._count.favorites,
    comments: recipe._count.comments,
    author: recipe.author.name,
    aColor: pickAuthorColor(recipe.author.name),
    desc: recipe.summary,
    createdAt: recipe.createdAt.toISOString(),
    publishedAt: recipe.publishedAt?.toISOString() || null,
  };
}

function mapCategory(category) {
  return {
    slug: category.slug,
    emoji: category.emoji || "🍽️",
    label: category.name,
    count: category._count.recipes,
    color: category.color || "#fff5eb",
    accent: category.accent || "#c84f03",
    desc: category.description || "",
  };
}

export async function getCategoryCards() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          recipes: true,
        },
      },
    },
  });

  return categories.map(mapCategory);
}

export async function getRecipeCards() {
  const recipes = await prisma.recipe.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          slug: true,
          name: true,
          emoji: true,
        },
      },
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  });

  return recipes.map(mapRecipe);
}

export async function getHomePageData() {
  const [categories, recipes] = await Promise.all([
    getCategoryCards(),
    getRecipeCards(),
  ]);

  const byLikes = [...recipes].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const newest = [...recipes]
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
    .slice(0, 6);
  const quickest = [...recipes].sort((a, b) => a.time - b.time).slice(0, 6);

  return {
    categories: categories.slice(0, 8),
    sections: [
      { id: "fav", title: "Favori Tarifler", icon: "❤️", href: "/favoriler", cards: byLikes },
      { id: "new", title: "Yeni Eklenenler", icon: "🆕", href: "/yeni-eklenenler", cards: newest },
      { id: "quick", title: "Hızlı Tarifler", icon: "⚡", href: "/tarifler?tip=hizli", cards: quickest },
    ],
  };
}

export async function getNewestRecipeCards() {
  const recipes = await getRecipeCards();

  return [...recipes].sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
}

function formatRelativeDate(value) {
  const now = Date.now();
  const diffDays = Math.max(0, Math.floor((now - new Date(value).getTime()) / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) {
    return "Bugün";
  }

  if (diffDays === 1) {
    return "1 gün önce";
  }

  if (diffDays < 7) {
    return `${diffDays} gün önce`;
  }

  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 hafta önce" : `${weeks} hafta önce`;
}

export async function getRecipeDetail(slug) {
  if (!slug) {
    return null;
  }

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        include: {
          _count: {
            select: {
              recipes: true,
            },
          },
        },
      },
      ingredients: {
        orderBy: { sortOrder: "asc" },
      },
      steps: {
        orderBy: { sortOrder: "asc" },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  });

  if (!recipe) {
    return null;
  }

  const related = await prisma.recipe.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: recipe.categoryId,
      slug: {
        not: slug,
      },
    },
    take: 3,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          slug: true,
          name: true,
          emoji: true,
        },
      },
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  });

  return {
    recipe: {
      ...mapRecipe(recipe),
      authorId: recipe.authorId,
      servings: recipe.servings || 4,
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.name,
        baseAmount: ingredient.amount === null ? null : Number(ingredient.amount),
        unit: ingredient.unit || "",
      })),
      steps: recipe.steps.map((step) => step.body),
      comments: recipe.comments.map((comment) => ({
        id: comment.id,
        author: comment.user.name,
        aColor: pickAuthorColor(comment.user.name),
        text: comment.body,
        date: formatRelativeDate(comment.createdAt),
        likes: 0,
      })),
    },
    category: mapCategory(recipe.category),
    related: related.map(mapRecipe),
  };
}

export async function getRecipeEditData(slug, userId) {
  if (!slug || !userId) {
    return null;
  }

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          slug: true,
        },
      },
      ingredients: {
        orderBy: { sortOrder: "asc" },
      },
      steps: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!recipe || recipe.authorId !== userId) {
    return null;
  }

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary,
    categorySlug: recipe.category.slug,
    imageUrl: recipe.imageUrl || "",
    prepMinutes: String(recipe.prepMinutes || 0),
    servings: String(recipe.servings || 4),
    difficulty: difficultyLabels[recipe.difficulty] || "Kolay",
    ingredients: recipe.ingredients.map((ingredient) => ingredient.name).join("\n"),
    steps: recipe.steps.map((step) => step.body).join("\n"),
  };
}

export async function getFavoriteRecipeCards(userId) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      recipe: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              slug: true,
              name: true,
              emoji: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  return favorites.map((favorite) => mapRecipe(favorite.recipe));
}

export async function getFavoriteRecipeIds(userId) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: {
      recipeId: true,
    },
  });

  return favorites.map((favorite) => favorite.recipeId);
}

export async function getProfileData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      recipes: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: {
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              slug: true,
              name: true,
              emoji: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              comments: true,
            },
          },
        },
        take: 6,
      },
      _count: {
        select: {
          recipes: true,
          favorites: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      recipesCount: user._count.recipes,
      favoritesCount: user._count.favorites,
    },
    recipes: user.recipes.map(mapRecipe),
  };
}
