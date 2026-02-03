import sendgrid from "@sendgrid/mail";

export async function sendInquiryEmail({ inquiryId, inquiry, items, productsBySku }) {
  const apiKey = process.env.EMAIL_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn("Email skipped: EMAIL_API_KEY/EMAIL_TO/EMAIL_FROM not configured");
    return { status: "skipped" };
  }

  sendgrid.setApiKey(apiKey);

  const itemLines = items
    .map((item) => {
      const product = productsBySku.get(item.sku);
      const name = product?.name || item.sku;
      const price = product?.price_display ? ` (${product.price_display})` : "";
      return `- ${name} x${item.qty}${price}`;
    })
    .join("\n");

  const text = `New inquiry ${inquiryId}\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || ""}\nCompany: ${inquiry.company || ""}\n\nMessage:\n${inquiry.message || ""}\n\nItems:\n${itemLines}\n\nSource URL: ${inquiry.sourceUrl || ""}`;

  const msg = {
    to,
    from,
    subject: `Whisked Away Inquiry ${inquiryId}`,
    text
  };

  await sendgrid.send(msg);
  return { status: "sent" };
}
