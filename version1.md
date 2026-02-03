Product Requirements Document (PRD)
Project

Whisked Away Bakery – v1.0

Architecture

Single Cloud Run Service
Node.js + Hono + htmx + Neon Postgres

1. Purpose & Vision

Whisked Away Bakery is a public-facing website with two primary content areas:

Bake Shop
An inquiry-based e-commerce experience (no payments) with:

browseable products

a true shopping cart

inquiry checkout

email notification to the bakery

Favorite Recipes
A lightweight CMS-managed content section allowing rich recipe posts to be created and edited without redeploying.

The site must:

be fast and SEO-friendly

avoid frontend frameworks

deploy cleanly from a GitHub repo to Google Cloud Run

remain inexpensive to operate

be easy to grow into a more sophisticated system later

2. Goals & Non-Goals
2.1 Goals

Replace Astro with server-rendered HTML

Use htmx for interactivity

Support:

product browsing

cart management

inquiry-based checkout

email notifications

CMS-style recipe editing

Use Neon Postgres as the primary datastore

Deploy via Cloud Run buildpacks (no Docker required)

Keep admin tooling minimal and secure

2.2 Non-Goals

Payments or checkout processing

User accounts or authentication for customers

Inventory reservation or stock enforcement

Full CMS platform or role-based admin system

3. Technology Stack
Backend

Node.js (LTS)

Hono (HTTP server + routing)

htmx (HTML-over-the-wire interactivity)

Quill (admin rich text editor)

Database

Neon Postgres

Hosting

Google Cloud Run

Source-based deploy from GitHub

Scale-to-zero enabled

Email

SendGrid or Mailgun

Single recipient address

4. High-Level Architecture
Browser
  |
  |  HTML + htmx
  |
Cloud Run (Node + Hono)
  |
  ├── Product pages (SSR)
  ├── Cart endpoints (cookie-based)
  ├── Inquiry checkout
  ├── Admin CMS pages
  |
Neon Postgres
  |
  ├── Products (future-ready)
  ├── Inquiries
  ├── Inquiry Items
  └── Favorite Recipes

5. Public Site Features
5.1 Pages

/ – Home

/bake-shop – Product listing

/bake-shop/:slug – Product detail

/cart – Cart view

/checkout – Inquiry checkout

/thank-you/:inquiryId – Confirmation

/recipes – Favorite Recipes list

/recipes/:slug – Recipe detail

All pages are server-rendered HTML.

6. Bake Shop (Inquiry-Based E-Com)
6.1 Product Browsing

Products are rendered server-side.

Products can initially be hardcoded or DB-backed.

Each product includes:

name

slug

sku

description

image(s)

price display (string)

6.2 Cart
Storage

Cart is stored in a signed cookie

Cookie payload:

{
  "items": [
    { "sku": "COOKIE-CHOCO", "qty": 2 }
  ]
}

Rules

Max 25 line items

Qty range: 1–999

SKU must exist

Cookie is signed to prevent tampering

Cart Actions

Add item

Update quantity

Remove item

Clear cart (after inquiry submit)

htmx Usage

Cart badge updates via fragment swap

Cart table updates without full page reload

Fallback to redirects if htmx unavailable

6.3 Inquiry Checkout
Form Fields

name (required)

email (required)

phone (optional)

company (optional)

message (optional)

Behavior

On submit:

Validate form + cart

Generate inquiry UUID

Insert inquiry record

Insert inquiry items

Send email notification

Clear cart cookie

Redirect or render confirmation

7. Favorite Recipes (Mini CMS)
7.1 Public Behavior

/recipes lists published recipes

/recipes/:slug shows full recipe

Recipe body rendered as trusted HTML

7.2 Data Model (Neon Postgres)
Table: favorite_recipes

id UUID PK

slug varchar unique not null

title varchar not null

image_url varchar

recipe_html text not null

published boolean default true

created_at timestamptz default now()

updated_at timestamptz default now()

Indexes:

unique(slug)

index(published)

8. Admin CMS (Option A)
8.1 Admin Access

All /admin/* routes protected via HTTP Basic Auth

Credentials stored as environment variables:

ADMIN_USER

ADMIN_PASS

8.2 Admin Pages
Routes

GET /admin/recipes

GET /admin/recipes/new

POST /admin/recipes

GET /admin/recipes/:id/edit

POST /admin/recipes/:id

POST /admin/recipes/:id/toggle-published

POST /admin/recipes/:id/delete

8.3 Recipe Editor

Uses Quill loaded via CDN

Editor content submitted as HTML

Stored in recipe_html

Editor Toolbar

Bold / Italic / Underline

H2 / H3

Bullet / Numbered lists

Links

Blockquotes

Images handled via image_url (not embedded).

8.4 Sanitization

recipe_html sanitized on save

Allowlist tags only

Strip scripts, iframes, JS URLs

9. Inquiries (Persistence)
9.1 Tables
inquiries

id UUID PK

name

email

phone

company

message

source_url

status (New/Contacted/Closed)

created_at

inquiry_items

id UUID PK

inquiry_id FK

sku

qty

name_snapshot

price_snapshot

10. Email Notifications
Behavior

Sent on successful inquiry

Single recipient

Includes:

inquiry id

contact details

message

item list

source URL

Failure Handling

Inquiry must still be saved

Email errors logged with inquiry id

11. Abuse & Safety
Required

Honeypot field

Input length limits

Email validation

Per-IP rate limiting (in-memory)

Optional (future)

CAPTCHA / Turnstile

Cloud Armor

12. Deployment
Cloud Run

Deploy from GitHub repo

Buildpacks (no Dockerfile)

Service listens on PORT

min instances = 0

Required Env Vars
DATABASE_URL
ADMIN_USER
ADMIN_PASS
COOKIE_SIGNING_SECRET
EMAIL_API_KEY
EMAIL_FROM
EMAIL_TO


Secrets stored via Cloud Run / Secret Manager.

13. Repo Structure (Recommended)
src/
  server.ts
  routes/
    public/
    admin/
  lib/
    db.ts
    cart.ts
    recipes.ts
    inquiries.ts
    sanitize.ts
  views/
    layout.html
    bake-shop/
    recipes/
    admin/
public/
  css/
  images/
migrations/
  001_favorite_recipes.sql
  002_inquiries.sql

14. Milestones
M1 – Core Site

SSR pages render

Static assets served

M2 – Cart

Add/update/remove

Cart persistence

M3 – Inquiry Checkout

DB persistence

Email notification

Confirmation

M4 – Recipes CMS

Admin CRUD

Quill editor

Publish toggle

M5 – Hardening

Rate limiting

Sanitization

Logging

15. Acceptance Criteria

Site fully deploys from repo to Cloud Run

No frontend framework required

Cart works across navigation

Inquiry submit:

writes to DB

sends email

clears cart

Recipes editable without redeploy

Admin protected by Basic Auth

Costs remain minimal at low traffic