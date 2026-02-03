export function renderAdminHome() {
  return `
  <section class="container page-header">
    <h1>Admin</h1>
    <p>Manage recipes and customer inquiries.</p>
  </section>
  <section class="container admin-links">
    <a class="button" href="/admin/products">Bake Shop Items</a>
    <a class="button" href="/admin/recipes">Manage Recipes</a>
    <a class="button ghost" href="/admin/inquiries">View Inquiries</a>
  </section>`;
}
