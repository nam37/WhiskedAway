import { escapeHtml } from "../../lib/escape.js";

export function renderProduct(product) {
  return `
  <section class="container page-header">
    <h1>${escapeHtml(product.name)}</h1>
    <p>${escapeHtml(product.description)}</p>
  </section>
  <section class="container product-detail">
    <div>
      <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" />
    </div>
    <div class="product-detail-info">
      <p class="price">${escapeHtml(product.price_display)}</p>
      <form method="post" action="/cart/add" hx-post="/cart/add" hx-target="#cart-badge" hx-swap="innerHTML">
        <input type="hidden" name="sku" value="${escapeHtml(product.sku)}" />
        <label class="field">
          <span>Quantity</span>
          <input type="number" name="qty" min="1" max="999" value="1" />
        </label>
        <button type="submit" class="button">Add to cart</button>
      </form>
      <p class="note">Questions? Tell us about pickup timing at checkout.</p>
    </div>
  </section>`;
}
