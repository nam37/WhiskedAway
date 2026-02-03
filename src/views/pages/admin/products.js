import { escapeHtml } from "../../../lib/escape.js";

export function renderAdminProducts(products) {
  const rows = products
    .map((product) => {
      return `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.sku)}</td>
        <td>${escapeHtml(product.slug)}</td>
        <td>${escapeHtml(product.price_display || "")}</td>
        <td class="table-actions">
          <a class="link" href="/admin/products/${escapeHtml(product.id)}/edit">Edit</a>
          <form method="post" action="/admin/products/${escapeHtml(product.id)}/delete" onsubmit="return confirm('Delete this product?');">
            <button type="submit" class="link-button danger">Delete</button>
          </form>
        </td>
      </tr>`;
    })
    .join("\n");

  return `
  <section class="container page-header">
    <h1>Bake Shop Items</h1>
    <a class="button" href="/admin/products/new">New Item</a>
  </section>
  <section class="container">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Slug</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows || "<tr><td colspan=\"5\">No products yet.</td></tr>"}
      </tbody>
    </table>
  </section>`;
}
