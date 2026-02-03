import { escapeHtml } from "../../../lib/escape.js";

export function renderAdminRecipes(recipes) {
  const rows = recipes
    .map((recipe) => {
      return `
      <tr>
        <td>${escapeHtml(recipe.title)}</td>
        <td>${escapeHtml(recipe.slug)}</td>
        <td>${recipe.published ? "Published" : "Draft"}</td>
        <td class="table-actions">
          <a class="link" href="/admin/recipes/${escapeHtml(recipe.id)}/edit">Edit</a>
          <form method="post" action="/admin/recipes/${escapeHtml(recipe.id)}/toggle-published">
            <button type="submit" class="link-button">${recipe.published ? "Unpublish" : "Publish"}</button>
          </form>
          <form method="post" action="/admin/recipes/${escapeHtml(recipe.id)}/delete" onsubmit="return confirm('Delete this recipe?');">
            <button type="submit" class="link-button danger">Delete</button>
          </form>
        </td>
      </tr>`;
    })
    .join("\n");

  return `
  <section class="container page-header">
    <h1>Recipes Admin</h1>
    <a class="button" href="/admin/recipes/new">New Recipe</a>
  </section>
  <section class="container">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Slug</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows || "<tr><td colspan=\"4\">No recipes yet.</td></tr>"}
      </tbody>
    </table>
  </section>`;
}
