import { escapeHtml } from "../../lib/escape.js";

export function renderCartBadge(count) {
  if (!count) return "";
  return `<span class="badge">${count}</span>`;
}

export function renderCartTable(cart, productsBySku) {
  if (!cart.items.length) {
    return `<div class="empty-state">Your cart is empty.</div>`;
  }

  const rows = cart.items
    .map((item) => {
      const product = productsBySku.get(item.sku);
      return `
      <tr>
        <td>${escapeHtml(product?.name || item.sku)}</td>
        <td>${escapeHtml(product?.price_display || "")}</td>
        <td>
          <form
            method="post"
            action="/cart/update"
            hx-post="/cart/update"
            hx-target="#cart-table"
            hx-swap="innerHTML"
          >
            <input
              type="number"
              min="1"
              max="999"
              name="qty"
              value="${item.qty}"
              hx-trigger="change"
            />
            <input type="hidden" name="sku" value="${escapeHtml(item.sku)}" />
            <button type="submit" class="link-button">Update</button>
          </form>
        </td>
        <td>
          <form method="post" action="/cart/remove" hx-post="/cart/remove" hx-target="#cart-table" hx-swap="innerHTML">
            <input type="hidden" name="sku" value="${escapeHtml(item.sku)}" />
            <button type="submit" class="link-button">Remove</button>
          </form>
        </td>
      </tr>`;
    })
    .join("\n");

  return `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Qty</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}
