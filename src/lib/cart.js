import crypto from "crypto";
import { getCookie, setCookie } from "hono/cookie";

const COOKIE_NAME = "wa_cart";
const MAX_ITEMS = 25;
const MAX_QTY = 999;

function signPayload(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeCart(cart, secret) {
  const payload = Buffer.from(JSON.stringify(cart), "utf8").toString("base64url");
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

function decodeCart(value, secret) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = signPayload(payload, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeCart(rawCart, productsBySku) {
  if (!rawCart || !Array.isArray(rawCart.items)) {
    return { items: [] };
  }
  const items = [];
  for (const item of rawCart.items) {
    if (!item || typeof item.sku !== "string") continue;
    const qty = Number(item.qty);
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) continue;
    if (!productsBySku.has(item.sku)) continue;
    items.push({ sku: item.sku, qty: Math.floor(qty) });
    if (items.length >= MAX_ITEMS) break;
  }
  return { items };
}

export function cartItemCount(cart) {
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

export async function readCart(c, products) {
  const secret = process.env.COOKIE_SIGNING_SECRET;
  if (!secret) {
    throw new Error("COOKIE_SIGNING_SECRET is not set");
  }
  const productsBySku = new Map(products.map((product) => [product.sku, product]));
  const rawValue = getCookie(c, COOKIE_NAME);
  const decoded = decodeCart(rawValue, secret);
  return normalizeCart(decoded, productsBySku);
}

export function writeCart(c, cart) {
  const secret = process.env.COOKIE_SIGNING_SECRET;
  if (!secret) {
    throw new Error("COOKIE_SIGNING_SECRET is not set");
  }
  const value = encodeCart(cart, secret);
  setCookie(c, COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearCart(c) {
  setCookie(c, COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 0
  });
}

export function upsertCartItem(cart, sku, qty) {
  const items = [...cart.items];
  const index = items.findIndex((item) => item.sku === sku);
  if (qty <= 0) {
    if (index >= 0) items.splice(index, 1);
    return { items };
  }
  if (index >= 0) {
    items[index] = { sku, qty };
  } else {
    items.push({ sku, qty });
  }
  return { items: items.slice(0, MAX_ITEMS) };
}

export function cartItemMap(cart) {
  return new Map(cart.items.map((item) => [item.sku, item.qty]));
}
