import { escapeHtml } from "../../lib/escape.js";

export function renderRecipe(recipe) {
  return `
  <section class="container page-header">
    <h1>${escapeHtml(recipe.title)}</h1>
    ${recipe.image_url ? `<img class="recipe-hero" src="${escapeHtml(recipe.image_url)}" alt="${escapeHtml(recipe.title)}" />` : ""}
  </section>
  <section class="container recipe-body">
    ${recipe.recipe_html}
  </section>`;
}
