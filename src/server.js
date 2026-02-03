import "dotenv/config";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "@hono/node-server/serve-static";
import { listProducts, getProductBySlug, getProductBySku } from "./lib/products.js";
import { readCart, writeCart, clearCart, upsertCartItem, cartItemCount } from "./lib/cart.js";
import { createInquiry } from "./lib/inquiries.js";
import { sendInquiryEmail } from "./lib/email.js";
import { listRecipes, getRecipeBySlug, getRecipeById, createRecipe, updateRecipe, toggleRecipePublished, deleteRecipe } from "./lib/recipes.js";
import { saveUploadedImage } from "./lib/upload.js";
import { layout } from "./views/layout.js";
import { renderHome } from "./views/pages/home.js";
import { renderBakeShop } from "./views/pages/bake-shop.js";
import { renderProduct } from "./views/pages/product.js";
import { renderCartPage } from "./views/pages/cart.js";
import { renderCheckoutPage } from "./views/pages/checkout.js";
import { renderThankYou } from "./views/pages/thank-you.js";
import { renderRecipes } from "./views/pages/recipes.js";
import { renderRecipe } from "./views/pages/recipe.js";
import { renderAdminRecipes } from "./views/pages/admin/index.js";
import { renderAdminRecipeForm } from "./views/pages/admin/edit.js";
import { renderCartBadge, renderCartTable } from "./views/partials/cart.js";

const app = new Hono();

app.use("/assets/*", serveStatic({ root: "./public" }));
app.use("/uploads/*", serveStatic({ root: "./public" }));

function isHtmx(c) {
  return c.req.header("HX-Request") === "true";
}

function setHtmxTrigger(c, eventName) {
  c.header("HX-Trigger", eventName);
}

async function getProductsBySku() {
  const products = await listProducts();
  return new Map(products.map((product) => [product.sku, product]));
}

app.get("/", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const body = renderHome();
  return c.html(layout({ title: "Whisked Away Bakery", body, cartCount: cartItemCount(cart) }));
});

app.get("/bake-shop", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const body = renderBakeShop(products);
  return c.html(layout({ title: "Bake Shop", body, cartCount: cartItemCount(cart) }));
});

app.get("/bake-shop/:slug", async (c) => {
  const products = await listProducts();
  const product = await getProductBySlug(c.req.param("slug"));
  if (!product) return c.notFound();
  const cart = await readCart(c, products);
  const body = renderProduct(product);
  return c.html(layout({ title: product.name, body, cartCount: cartItemCount(cart) }));
});

app.get("/cart", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const productsBySku = await getProductsBySku();
  const body = renderCartPage(cart, productsBySku);
  return c.html(layout({ title: "Your Cart", body, cartCount: cartItemCount(cart) }));
});

app.get("/cart/badge", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  return c.html(renderCartBadge(cartItemCount(cart)));
});

app.post("/cart/add", async (c) => {
  const products = await listProducts();
  const body = await c.req.parseBody();
  const sku = String(body.sku || "");
  const qty = Math.min(Math.max(Number(body.qty || 1), 1), 999);
  const product = await getProductBySku(sku);
  if (!product) return c.text("Invalid SKU", 400);

  const cart = await readCart(c, products);
  const nextCart = upsertCartItem(cart, sku, qty);
  writeCart(c, nextCart);

  if (isHtmx(c)) {
    setHtmxTrigger(c, "cart-updated");
    return c.html(renderCartBadge(cartItemCount(nextCart)));
  }
  return c.redirect("/cart", 303);
});

app.post("/cart/update", async (c) => {
  const products = await listProducts();
  const body = await c.req.parseBody();
  const sku = String(body.sku || "");
  const qty = Math.min(Math.max(Number(body.qty || 1), 1), 999);
  const product = await getProductBySku(sku);
  if (!product) return c.text("Invalid SKU", 400);

  const cart = await readCart(c, products);
  const nextCart = upsertCartItem(cart, sku, qty);
  writeCart(c, nextCart);

  if (isHtmx(c)) {
    const productsBySku = await getProductsBySku();
    setHtmxTrigger(c, "cart-updated");
    return c.html(renderCartTable(nextCart, productsBySku));
  }
  return c.redirect("/cart", 303);
});

app.post("/cart/remove", async (c) => {
  const products = await listProducts();
  const body = await c.req.parseBody();
  const sku = String(body.sku || "");
  const cart = await readCart(c, products);
  const nextCart = upsertCartItem(cart, sku, 0);
  writeCart(c, nextCart);

  if (isHtmx(c)) {
    const productsBySku = await getProductsBySku();
    setHtmxTrigger(c, "cart-updated");
    return c.html(renderCartTable(nextCart, productsBySku));
  }
  return c.redirect("/cart", 303);
});

app.get("/checkout", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const body = renderCheckoutPage({ hasItems: cart.items.length > 0 });
  return c.html(layout({ title: "Inquiry Checkout", body, cartCount: cartItemCount(cart) }));
});

app.post("/checkout", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  if (!cart.items.length) return c.text("Cart is empty", 400);

  const body = await c.req.parseBody();
  if (body.website) return c.text("Spam detected", 400);

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email) return c.text("Name and email are required", 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return c.text("Email is invalid", 400);

  const productsBySku = await getProductsBySku();
  const inquiryId = await createInquiry(
    { name, email, phone, company, message, sourceUrl: c.req.header("referer") || "" },
    cart.items,
    productsBySku
  );

  try {
    await sendInquiryEmail({ inquiryId, inquiry: { name, email, phone, company, message, sourceUrl: c.req.header("referer") || "" }, items: cart.items, productsBySku });
  } catch (error) {
    console.error("Email send failed", error);
  }

  clearCart(c);
  return c.redirect(`/thank-you/${inquiryId}`, 303);
});

app.get("/thank-you/:inquiryId", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const body = renderThankYou(c.req.param("inquiryId"));
  return c.html(layout({ title: "Thank You", body, cartCount: cartItemCount(cart) }));
});

app.get("/recipes", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const recipes = await listRecipes();
  const body = renderRecipes(recipes);
  return c.html(layout({ title: "Favorite Recipes", body, cartCount: cartItemCount(cart) }));
});

app.get("/recipes/:slug", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const recipe = await getRecipeBySlug(c.req.param("slug"));
  if (!recipe) return c.notFound();
  const body = renderRecipe(recipe);
  return c.html(layout({ title: recipe.title, body, cartCount: cartItemCount(cart) }));
});

app.use(
  "/admin/*",
  basicAuth({
    username: process.env.ADMIN_USER || "admin",
    password: process.env.ADMIN_PASS || "admin"
  })
);

app.get("/admin", (c) => c.redirect("/admin/recipes", 302));

app.get("/admin/recipes", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const recipes = await listRecipes({ includeDrafts: true });
  const body = renderAdminRecipes(recipes);
  return c.html(layout({ title: "Recipes Admin", body, cartCount: cartItemCount(cart) }));
});

app.get("/admin/recipes/new", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const { body, head } = renderAdminRecipeForm({ recipe: null, formAction: "/admin/recipes", title: "New Recipe" });
  return c.html(layout({ title: "New Recipe", body, head, cartCount: cartItemCount(cart) }));
});

app.post("/admin/recipes", async (c) => {
  const body = await c.req.parseBody();
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();
  const recipeHtml = String(body.recipe_html || "");
  const published = Boolean(body.published);
  const imageUrlField = String(body.image_url || "").trim();

  let imageUrl = imageUrlField;
  if (body.image_file && typeof body.image_file.arrayBuffer === "function") {
    imageUrl = await saveUploadedImage(body.image_file, slug || title || "recipe");
  }

  await createRecipe({ title, slug, imageUrl, recipeHtml, published });
  return c.redirect("/admin/recipes", 303);
});

app.get("/admin/recipes/:id/edit", async (c) => {
  const products = await listProducts();
  const cart = await readCart(c, products);
  const recipe = await getRecipeById(c.req.param("id"));
  if (!recipe) return c.notFound();
  const { body, head } = renderAdminRecipeForm({ recipe, formAction: `/admin/recipes/${recipe.id}`, title: "Edit Recipe" });
  return c.html(layout({ title: "Edit Recipe", body, head, cartCount: cartItemCount(cart) }));
});

app.post("/admin/recipes/:id", async (c) => {
  const body = await c.req.parseBody();
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();
  const recipeHtml = String(body.recipe_html || "");
  const published = Boolean(body.published);
  const imageUrlField = String(body.image_url || "").trim();

  let imageUrl = imageUrlField;
  if (body.image_file && typeof body.image_file.arrayBuffer === "function") {
    imageUrl = await saveUploadedImage(body.image_file, slug || title || "recipe");
  }

  await updateRecipe(c.req.param("id"), { title, slug, imageUrl, recipeHtml, published });
  return c.redirect("/admin/recipes", 303);
});

app.post("/admin/recipes/:id/toggle-published", async (c) => {
  await toggleRecipePublished(c.req.param("id"));
  return c.redirect("/admin/recipes", 303);
});

app.post("/admin/recipes/:id/delete", async (c) => {
  await deleteRecipe(c.req.param("id"));
  return c.redirect("/admin/recipes", 303);
});

app.notFound((c) => c.text("Not Found", 404));

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }
  if (error?.status !== 401) {
    console.error(error);
  }
  return c.text("Something went wrong", 500);
});

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port });

console.log(`Whisked Away server running on http://localhost:${port}`);
