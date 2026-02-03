import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "products.json");

let cachedProducts;

export async function listProducts() {
  if (cachedProducts) return cachedProducts;
  const raw = await readFile(dataPath, "utf8");
  const normalized = raw.replace(/^\uFEFF/, "");
  cachedProducts = JSON.parse(normalized);
  return cachedProducts;
}

export async function getProductBySlug(slug) {
  const products = await listProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductBySku(sku) {
  const products = await listProducts();
  return products.find((product) => product.sku === sku) || null;
}
