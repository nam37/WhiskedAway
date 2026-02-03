import { escapeHtml } from "../../lib/escape.js";

export function renderRecipes(recipes) {
  const cards = recipes
    .map((recipe) => {
      return `
      <article class="recipe-card">
        ${recipe.image_url ? `<img src="${escapeHtml(recipe.image_url)}" alt="${escapeHtml(recipe.title)}" />` : ""}
        <div>
          <h3><a href="/recipes/${escapeHtml(recipe.slug)}">${escapeHtml(recipe.title)}</a></h3>
          <p class="muted">Published ${new Date(recipe.created_at).toLocaleDateString("en-US")}</p>
        </div>
      </article>`;
    })
    .join("\n");

  return `
  <section class="container page-header">
    <h1>Favorite Recipes</h1>
    <p>Trusted bakes from our kitchen, shared for your home table.</p>
  </section>
  <section class="container recipe-grid">
    ${cards || "<p>No recipes yet.</p>"}
  </section>`;
}
