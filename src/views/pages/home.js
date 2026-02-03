import { escapeHtml } from "../../lib/escape.js";

export function renderHome() {
  return `
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <p class="eyebrow">Small-batch bakery</p>
        <h1 class="brand-title">
          <span class="brand-gradient">Whisked Away</span>
          <span class="brand-subtitle">Bakery</span>
        </h1>
        <p>Seasonal pastries, celebration cakes, and warm breads baked fresh every morning.</p>
        <div class="hero-actions">
          <a class="button" href="/bake-shop">Browse Bake Shop</a>
          <a class="button ghost" href="/recipes">Favorite Recipes</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="/assets/images/Whisked-Away-Bakery-2.png" alt="Whisked Away Bakery logo" />
      </div>
    </div>
  </section>
  <section class="container features">
    <div>
      <h2>Inquiry-based orders</h2>
      <p>Send us your cart with a note about pickup timing and any custom touches.</p>
    </div>
    <div>
      <h2>Seasonal favorites</h2>
      <p>Rotating menus inspired by the farmstands, farmers markets, and local growers.</p>
    </div>
    <div>
      <h2>Handcrafted with care</h2>
      <p>Small batches, real butter, and thoughtful details in every bake.</p>
    </div>
  </section>`;
}
