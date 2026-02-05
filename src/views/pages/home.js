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
      <p>Whether it’s a weekend brunch or a work celebration, we’ll help you build a mix that travels well and serves beautifully.</p>
    </div>
    <div class="feature-card feature-seasonal">
      <h2>Seasonal favorites</h2>
      <p>Rotating menus inspired by the farmstands, farmers markets, and local growers.</p>
      <p>Expect bright fruit tarts in summer, cozy spice cakes in fall, and a few beloved staples year-round.</p>
      <p>We post new bakes regularly, so there’s always a reason to check back for the next limited batch.</p>
    </div>
    <div class="feature-card feature-baker">
      <h2>Meet the Baker</h2>
      <img class="feature-baker-image" src="/assets/images/baker-1.jpg" alt="Baker portrait" />
      <p>Get to know the hands behind every loaf and the story behind Whisked Away.</p>
      <p>Our cottage kitchen is a calm, flour-dusted space where recipes are tested, refined, and shared with neighbors.</p>
    </div>
    <div class="feature-card feature-handcrafted">
      <h2>Handcrafted with care</h2>
      <p>Small batches, real butter, and thoughtful details in every bake.</p>
      <p>We favor slow fermentations, local eggs, and the kind of finishes that make a simple pastry feel special.</p>
      <p>Each batch is mixed and shaped by hand, keeping quality high and flavors exactly where we want them.</p>
    </div>
    <div class="feature-card feature-why">
      <h2>Why a Cottage Bakery?</h2>
      <p>Thoughtful sourcing, slow mornings, and neighborhood connections that keep things personal.</p>
      <p>It lets us stay small, bake with intention, and say yes to the custom touches that larger shops can’t.</p>
      <p>We love knowing our regulars by name and baking for the moments that make your week a little sweeter.</p>
    </div>
  </section>`;
}
