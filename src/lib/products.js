import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { query, isDatabaseConfigured } from "./db.js";
import { slugify } from "./slugify.js";
import { sanitizeProductHtml } from "./sanitize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "products.json");

async function loadJsonProducts() {
  try {
    const raw = await readFile(dataPath, "utf8");
    const normalized = raw.replace(/^\uFEFF/, "");
    const products = JSON.parse(normalized);
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

async function saveJsonProducts(products) {
  const payload = JSON.stringify(products, null, 2);
  await writeFile(dataPath, payload, "utf8");
}

function shouldUseDatabase() {
  return isDatabaseConfigured();
}

async function withDatabaseFallback(taskName, dbFn, fallbackFn) {
  if (!shouldUseDatabase()) {
    return fallbackFn();
  }
  try {
    return await dbFn();
  } catch (error) {
    console.warn(`${taskName} failed, falling back to JSON`, error);
    return fallbackFn();
  }
}

export async function listProducts() {
  return withDatabaseFallback(
    "Product list",
    async () => {
      const result = await query("SELECT * FROM products ORDER BY name ASC");
      return result.rows;
    },
    async () => {
      const products = await loadJsonProducts();
      return products.sort((a, b) => a.name.localeCompare(b.name));
    }
  );
}

export async function getProductBySlug(slug) {
  return withDatabaseFallback(
    "Product by slug",
    async () => {
      const result = await query("SELECT * FROM products WHERE slug = $1 LIMIT 1", [slug]);
      return result.rows[0] || null;
    },
    async () => {
      const products = await loadJsonProducts();
      return products.find((product) => product.slug === slug) || null;
    }
  );
}

export async function getProductBySku(sku) {
  return withDatabaseFallback(
    "Product by sku",
    async () => {
      const result = await query("SELECT * FROM products WHERE sku = $1 LIMIT 1", [sku]);
      return result.rows[0] || null;
    },
    async () => {
      const products = await loadJsonProducts();
      return products.find((product) => product.sku === sku) || null;
    }
  );
}

export async function getProductById(id) {
  return withDatabaseFallback(
    "Product by id",
    async () => {
      const result = await query("SELECT * FROM products WHERE id = $1", [id]);
      return result.rows[0] || null;
    },
    async () => {
      const products = await loadJsonProducts();
      return products.find((product) => product.id === id) || null;
    }
  );
}

export async function createProduct({ sku, slug, name, description, imageUrl, priceDisplay }) {
  const finalSlug = slugify(slug || name);
  const finalSku = String(sku || "").trim();
  const sanitizedDescription = sanitizeProductHtml(description);

  return withDatabaseFallback(
    "Create product",
    async () => {
      const result = await query(
        `INSERT INTO products (sku, slug, name, description, image_url, price_display)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [finalSku, finalSlug, name, sanitizedDescription || "", imageUrl || "", priceDisplay || ""]
      );
      return result.rows[0];
    },
    async () => {
      const products = await loadJsonProducts();
      if (products.some((product) => product.sku === finalSku)) {
        throw new Error("Product SKU already exists");
      }
      if (products.some((product) => product.slug === finalSlug)) {
        throw new Error("Product slug already exists");
      }
      const product = {
        id: crypto.randomUUID(),
        sku: finalSku,
        slug: finalSlug,
        name,
        description: sanitizedDescription || "",
        image_url: imageUrl || "",
        price_display: priceDisplay || ""
      };
      products.push(product);
      await saveJsonProducts(products);
      return product;
    }
  );
}

export async function updateProduct(id, { sku, slug, name, description, imageUrl, priceDisplay }) {
  const finalSlug = slugify(slug || name);
  const finalSku = String(sku || "").trim();
  const sanitizedDescription = sanitizeProductHtml(description);

  return withDatabaseFallback(
    "Update product",
    async () => {
      const result = await query(
        `UPDATE products
           SET sku = $1,
               slug = $2,
               name = $3,
               description = $4,
               image_url = $5,
               price_display = $6,
               updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [finalSku, finalSlug, name, sanitizedDescription || "", imageUrl || "", priceDisplay || "", id]
      );
      return result.rows[0];
    },
    async () => {
      const products = await loadJsonProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) return null;
      if (products.some((product, idx) => product.sku === finalSku && idx !== index)) {
        throw new Error("Product SKU already exists");
      }
      if (products.some((product, idx) => product.slug === finalSlug && idx !== index)) {
        throw new Error("Product slug already exists");
      }
      const updated = {
        ...products[index],
        sku: finalSku,
        slug: finalSlug,
        name,
        description: sanitizedDescription || "",
        image_url: imageUrl || "",
        price_display: priceDisplay || ""
      };
      products[index] = updated;
      await saveJsonProducts(products);
      return updated;
    }
  );
}

export async function deleteProduct(id) {
  return withDatabaseFallback(
    "Delete product",
    async () => {
      await query("DELETE FROM products WHERE id = $1", [id]);
    },
    async () => {
      const products = await loadJsonProducts();
      const next = products.filter((product) => product.id !== id);
      await saveJsonProducts(next);
    }
  );
}
