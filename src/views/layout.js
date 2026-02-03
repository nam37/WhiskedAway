import { escapeHtml } from "../lib/escape.js";
import { renderCartBadge } from "./partials/cart.js";

export function layout({ title, body, cartCount = 0, head = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    ${head}
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="/">
          <img src="/assets/images/whisked-away-logo.png" alt="Whisked Away Bakery" />
          <span class="logo-text">
            <span class="brand-gradient">Whisked Away</span>
            <span class="brand-subtitle">Bakery</span>
          </span>
        </a>
        <nav class="site-nav">
          <a href="/bake-shop">Bake Shop</a>
          <a href="/recipes">Favorite Recipes</a>
          <a href="/cart" class="cart-link">
            Cart
            <span
              id="cart-badge"
              hx-get="/cart/badge"
              hx-trigger="load, cart-updated from:body"
              hx-swap="innerHTML"
            >${renderCartBadge(cartCount)}</span>
          </a>
        </nav>
      </div>
    </header>
    <main>
      ${body}
    </main>
    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>Whisked Away Bakery</strong>
          <p>Small-batch bakes, custom cakes, and seasonal favorites.</p>
        </div>
        <div>
          <p>Email: hello@whiskedaway.com</p>
          <p>Phone: (555) 212-3344</p>
        </div>
      </div>
    </footer>
  </body>
</html>`;
}
