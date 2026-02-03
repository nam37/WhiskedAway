import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { query, isDatabaseConfigured } from "./db.js";
import { sanitizeRecipeHtml } from "./sanitize.js";
import { slugify } from "./slugify.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "recipes.json");

async function loadJsonRecipes() {
  try {
    const raw = await readFile(dataPath, "utf8");
    const normalized = raw.replace(/^\uFEFF/, "");
    const recipes = JSON.parse(normalized);
    return Array.isArray(recipes) ? recipes : [];
  } catch {
    return [];
  }
}

async function saveJsonRecipes(recipes) {
  const payload = JSON.stringify(recipes, null, 2);
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

export async function listRecipes({ includeDrafts = false } = {}) {
  return withDatabaseFallback(
    "Recipe list",
    async () => {
      const text = includeDrafts
        ? "SELECT * FROM favorite_recipes ORDER BY created_at DESC"
        : "SELECT * FROM favorite_recipes WHERE published = true ORDER BY created_at DESC";
      const result = await query(text);
      return result.rows;
    },
    async () => {
      const recipes = await loadJsonRecipes();
      return recipes
        .filter((recipe) => includeDrafts || recipe.published)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  );
}

export async function getRecipeBySlug(slug, { includeDrafts = false } = {}) {
  return withDatabaseFallback(
    "Recipe lookup",
    async () => {
      const text = includeDrafts
        ? "SELECT * FROM favorite_recipes WHERE slug = $1 LIMIT 1"
        : "SELECT * FROM favorite_recipes WHERE slug = $1 AND published = true LIMIT 1";
      const result = await query(text, [slug]);
      return result.rows[0] || null;
    },
    async () => {
      const recipes = await loadJsonRecipes();
      return (
        recipes.find(
          (recipe) => recipe.slug === slug && (includeDrafts || recipe.published)
        ) || null
      );
    }
  );
}

export async function getRecipeById(id) {
  return withDatabaseFallback(
    "Recipe by id",
    async () => {
      const result = await query("SELECT * FROM favorite_recipes WHERE id = $1", [id]);
      return result.rows[0] || null;
    },
    async () => {
      const recipes = await loadJsonRecipes();
      return recipes.find((recipe) => recipe.id === id) || null;
    }
  );
}

export async function createRecipe({ title, slug, imageUrl, recipeHtml, published }) {
  const finalSlug = slugify(slug || title);
  const sanitizedHtml = sanitizeRecipeHtml(recipeHtml);

  return withDatabaseFallback(
    "Create recipe",
    async () => {
      const result = await query(
        `INSERT INTO favorite_recipes (slug, title, image_url, recipe_html, published)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [finalSlug, title, imageUrl || null, sanitizedHtml, Boolean(published)]
      );
      return result.rows[0];
    },
    async () => {
      const recipes = await loadJsonRecipes();
      if (recipes.some((recipe) => recipe.slug === finalSlug)) {
        throw new Error("Recipe slug already exists");
      }
      const now = new Date().toISOString();
      const recipe = {
        id: crypto.randomUUID(),
        slug: finalSlug,
        title,
        image_url: imageUrl || "",
        recipe_html: sanitizedHtml,
        published: Boolean(published),
        created_at: now,
        updated_at: now
      };
      recipes.unshift(recipe);
      await saveJsonRecipes(recipes);
      return recipe;
    }
  );
}

export async function updateRecipe(id, { title, slug, imageUrl, recipeHtml, published }) {
  const finalSlug = slugify(slug || title);
  const sanitizedHtml = sanitizeRecipeHtml(recipeHtml);

  return withDatabaseFallback(
    "Update recipe",
    async () => {
      const result = await query(
        `UPDATE favorite_recipes
           SET slug = $1,
               title = $2,
               image_url = $3,
               recipe_html = $4,
               published = $5,
               updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [finalSlug, title, imageUrl || null, sanitizedHtml, Boolean(published), id]
      );
      return result.rows[0];
    },
    async () => {
      const recipes = await loadJsonRecipes();
      const index = recipes.findIndex((recipe) => recipe.id === id);
      if (index === -1) return null;
      if (recipes.some((recipe, idx) => recipe.slug === finalSlug && idx !== index)) {
        throw new Error("Recipe slug already exists");
      }
      const current = recipes[index];
      const updated = {
        ...current,
        slug: finalSlug,
        title,
        image_url: imageUrl || "",
        recipe_html: sanitizedHtml,
        published: Boolean(published),
        updated_at: new Date().toISOString()
      };
      recipes[index] = updated;
      await saveJsonRecipes(recipes);
      return updated;
    }
  );
}

export async function toggleRecipePublished(id) {
  return withDatabaseFallback(
    "Toggle recipe",
    async () => {
      const result = await query(
        `UPDATE favorite_recipes
            SET published = NOT published,
                updated_at = NOW()
          WHERE id = $1
          RETURNING *`,
        [id]
      );
      return result.rows[0];
    },
    async () => {
      const recipes = await loadJsonRecipes();
      const index = recipes.findIndex((recipe) => recipe.id === id);
      if (index === -1) return null;
      recipes[index] = {
        ...recipes[index],
        published: !recipes[index].published,
        updated_at: new Date().toISOString()
      };
      await saveJsonRecipes(recipes);
      return recipes[index];
    }
  );
}

export async function deleteRecipe(id) {
  return withDatabaseFallback(
    "Delete recipe",
    async () => {
      await query("DELETE FROM favorite_recipes WHERE id = $1", [id]);
    },
    async () => {
      const recipes = await loadJsonRecipes();
      const next = recipes.filter((recipe) => recipe.id !== id);
      await saveJsonRecipes(next);
    }
  );
}
