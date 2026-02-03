import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "products.json");

export async function listProducts() {
  const raw = await readFile(dataPath, "utf8");
  const normalized = raw.replace(/^\uFEFF/, "");
  return JSON.parse(normalized);
}

export async function getProductBySlug(slug) {
  const products = await listProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductBySku(sku) {
  const products = await listProducts();
  return products.find((product) => product.sku === sku) || null;
}
