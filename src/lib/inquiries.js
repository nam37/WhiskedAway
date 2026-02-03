import crypto from "crypto";
import { getPool } from "./db.js";

export async function createInquiry({
  name,
  email,
  phone,
  company,
  message,
  sourceUrl
}, items, productsBySku) {
  const pool = getPool();
  const client = await pool.connect();
  const inquiryId = crypto.randomUUID();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO inquiries (id, name, email, phone, company, message, source_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'New')`,
      [inquiryId, name, email, phone || null, company || null, message || null, sourceUrl || null]
    );

    for (const item of items) {
      const product = productsBySku.get(item.sku);
      await client.query(
        `INSERT INTO inquiry_items (id, inquiry_id, sku, qty, name_snapshot, price_snapshot)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          inquiryId,
          item.sku,
          item.qty,
          product?.name || item.sku,
          product?.price_display || null
        ]
      );
    }

    await client.query("COMMIT");
    return inquiryId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
