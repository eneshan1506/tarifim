import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "recipes");
const PUBLIC_PREFIX = "/uploads/recipes";

function getExtension(file) {
  const fromName = path.extname(file.name || "").toLowerCase();

  if (fromName) {
    return fromName;
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}

export async function saveUploadedImage(file) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("INVALID_FILE_TYPE");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("FILE_TOO_LARGE");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const extension = getExtension(file);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `${PUBLIC_PREFIX}/${fileName}`;
}

export async function deleteLocalImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith(PUBLIC_PREFIX)) {
    return;
  }

  const filePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));

  try {
    await unlink(filePath);
  } catch {
    // Dosya daha once silinmis olabilir.
  }
}
