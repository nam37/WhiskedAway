import { escapeHtml } from "../../lib/escape.js";
import { sanitizeProductHtml } from "../../lib/sanitize.js";

export function renderBakeShop(products) {
  const cards = products
    .map((product) => {
      return `
      <article class="product-card">
        <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" />
        <div class="product-card-body">
          <h3><a href="/bake-shop/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a></h3>
          <div class="product-description">${sanitizeProductHtml(product.description)}</div>
          <div class="product-card-footer">
            <span>${escapeHtml(product.price_display)}</span>
            <form method="post" action="/cart/add" hx-post="/cart/add" hx-target="#cart-badge" hx-swap="innerHTML">
              <input type="hidden" name="sku" value="${escapeHtml(product.sku)}" />
              <button type="submit" class="button small">Add to cart</button>
            </form>
          </div>
        </div>
      </article>`;
    })
    .join("\n");

  return `
  <section class="container page-header">
    <h1>Bake Shop</h1>
    <p>Explore today\'s bake list and send us an inquiry when you\'re ready.</p>
  </section>
  <section class="container product-grid">
    ${cards}
  </section>`;
}

