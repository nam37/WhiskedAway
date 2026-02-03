import { renderCartTable } from "../partials/cart.js";

export function renderCartPage(cart, productsBySku) {
  const table = renderCartTable(cart, productsBySku);
  return `
  <section class="container page-header">
    <h1>Your Cart</h1>
    <p>Review your items and send an inquiry when you\'re ready.</p>
  </section>
  <section class="container" id="cart-table">
    ${table}
  </section>
  <section class="container cart-actions">
    <a class="button" href="/checkout">Proceed to inquiry</a>
  </section>`;
}
