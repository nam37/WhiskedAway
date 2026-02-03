import { escapeHtml } from "../../../lib/escape.js";

export function renderAdminInquiries(inquiries) {
  const rows = inquiries
    .map((inquiry) => {
      const items = inquiry.items
        .map((item) => `${escapeHtml(item.name_snapshot || item.sku)} x${item.qty}`)
        .join(", ");
      return `
      <tr>
        <td>${escapeHtml(inquiry.name)}</td>
        <td>${escapeHtml(inquiry.email)}</td>
        <td>${escapeHtml(inquiry.phone || "")}</td>
        <td>${escapeHtml(inquiry.company || "")}</td>
        <td>${escapeHtml(inquiry.status || "New")}</td>
        <td>${new Date(inquiry.created_at).toLocaleDateString("en-US")}</td>
        <td>${escapeHtml(items)}</td>
        <td>
          <details class="message-details">
            <summary>View</summary>
            <p>${escapeHtml(inquiry.message || "No message provided.")}</p>
          </details>
        </td>
      </tr>`;
    })
    .join("\n");

  return `
  <section class="container page-header">
    <h1>Inquiries</h1>
    <a class="link" href="/admin">Back to admin</a>
  </section>
  <section class="container">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Status</th>
          <th>Date</th>
          <th>Items</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${rows || "<tr><td colspan=\"8\">No inquiries yet.</td></tr>"}
      </tbody>
    </table>
  </section>`;
}
