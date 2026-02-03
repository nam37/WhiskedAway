import { escapeHtml } from "../../lib/escape.js";

export function renderThankYou(inquiryId) {
  return `
  <section class="container page-header">
    <h1>Thank you!</h1>
    <p>Your inquiry has been sent. We\'ll follow up shortly.</p>
    <p class="note">Inquiry ID: ${escapeHtml(inquiryId)}</p>
    <a class="button" href="/bake-shop">Return to Bake Shop</a>
  </section>`;
}
