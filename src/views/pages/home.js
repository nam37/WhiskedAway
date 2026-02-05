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
        <p>From weeknight treats to milestone celebrations, we keep the menu thoughtful, flexible, and rooted in simple ingredients.</p>
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
    <div class="feature-card feature-inquiry">
      <h2>Inquiry-based orders</h2>
      <p>Send us your cart with a note about pickup timing and any custom touches.</p>
      <p>We confirm availability, suggest serving sizes, and make sure every detail is just right for your table.</p>
    </div>
    <div class="feature-card feature-seasonal">
      <h2>Seasonal favorites</h2>
      <p>Rotating menus inspired by the farmstands, farmers markets, and local growers.</p>
      <p>Expect bright fruit tarts in summer, cozy spice cakes in fall, and a few beloved staples year-round.</p>
    </div>
    <div class="feature-card feature-baker">
      <h2>Meet the Baker</h2>
      <img
        class="feature-baker-image"
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='320' viewBox='0 0 520 320'><rect width='520' height='320' fill='%23f4eee6'/><rect x='28' y='28' width='464' height='264' rx='22' fill='%23ffffff' stroke='%23c9b8a6' stroke-width='3'/><g fill='%23c9b8a6'><circle cx='260' cy='130' r='38'/><rect x='196' y='176' width='128' height='72' rx='28'/></g><g fill='%23b08f6f'><rect x='152' y='96' width='216' height='26' rx='12'/><rect x='182' y='208' width='156' height='18' rx='9'/></g><text x='260' y='268' font-family='Georgia, serif' font-size='20' text-anchor='middle' fill='%23806a58'>Baker Portrait</text></svg>"
        alt="Baker portrait placeholder"
      />
      <p>Get to know the hands behind every loaf and the story behind Whisked Away.</p>
      <p>Our cottage kitchen is a calm, flour-dusted space where recipes are tested, refined, and shared with neighbors.</p>
    </div>
    <div class="feature-card feature-handcrafted">
      <h2>Handcrafted with care</h2>
      <p>Small batches, real butter, and thoughtful details in every bake.</p>
      <p>We favor slow fermentations, local eggs, and the kind of finishes that make a simple pastry feel special.</p>
    </div>
    <div class="feature-card feature-why">
      <h2>Why a Cottage Bakery?</h2>
      <p>Thoughtful sourcing, slow mornings, and neighborhood connections that keep things personal.</p>
      <p>It lets us stay small, bake with intention, and say yes to the custom touches that larger shops can’t.</p>
    </div>
  </section>`;
}
