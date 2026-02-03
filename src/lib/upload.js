import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(file, slugBase = "recipe") {
  if (!file || typeof file.arrayBuffer !== "function") return null;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image upload exceeds 5MB limit");
  }
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed");
  }

  const ext = path.extname(file.name || "") || ".jpg";
  const safeBase = slugBase.replace(/[^a-z0-9-]+/g, "-");
  const filename = `${safeBase}-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}
