export function renderCheckoutPage({ hasItems, cartSummary }) {
  if (!hasItems) {
    return `
    <section class="container page-header">
      <h1>Inquiry Checkout</h1>
      <p>Your cart is empty. Please add items before submitting an inquiry.</p>
      <a class="button" href="/bake-shop">Back to Bake Shop</a>
    </section>`;
  }

  return `
  <section class="container page-header">
    <h1>Inquiry Checkout</h1>
    <p>Tell us about your order. We\'ll follow up within 1 business day.</p>
  </section>
  <section class="container checkout-grid">
    <div class="form-card">
      <form method="post" action="/checkout">
        <div class="form-grid">
          <label class="field">
            <span>Name *</span>
            <input type="text" name="name" required />
          </label>
          <label class="field">
            <span>Email *</span>
            <input type="email" name="email" required />
          </label>
          <label class="field">
            <span>Phone</span>
            <input type="tel" name="phone" />
          </label>
          <label class="field">
            <span>Company</span>
            <input type="text" name="company" />
          </label>
        </div>
        <label class="field">
          <span>Message</span>
          <textarea name="message" rows="4"></textarea>
        </label>
        <label class="field honeypot">
          <span>Leave this field empty</span>
          <input type="text" name="website" />
        </label>
        <button type="submit" class="button">Send inquiry</button>
      </form>
    </div>
    <aside class="checkout-summary">
      <h3>Order Summary</h3>
      ${cartSummary}
    </aside>
  </section>`;
}
