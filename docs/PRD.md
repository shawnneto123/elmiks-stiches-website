# Product Requirements Document (PRD)
## Project: Elmik Stitches — E-Commerce Web Application

**Prepared for:** Autonomous AI coding agent (Google Antigravity)
**Prepared by:** Lead Software Architect (AI-generated spec)
**Version:** 1.0

---

## 1. Business Context

| Field | Value |
|---|---|
| Brand Name | Elmik Stitches |
| Instagram | @elmik_stitchesrtw |
| Business Model | Ready-To-Wear (RTW) + Custom Bespoke Tailoring |
| Physical Address | House 67, 2nd Avenue, Efab City Estate, Jabi, Mbora, FCT, Abuja |
| Physical Store Hours | 9:00 AM – 5:30 PM (WAT) |
| Online Store | 24/7 availability |
| Delivery | Worldwide + physical pickup. Fees calculated manually — NOT computed by the app |
| Currency | Nigerian Naira (₦) only |

**Critical constraint:** This is a **catalog + lead-generation** app, not a transactional e-commerce app. There is no cart, no payment gateway, no order database table for transactions. The "conversion event" is a WhatsApp deep link. Do not build checkout, cart persistence, or payment infrastructure — it is explicitly out of scope and would violate the spec.

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                     │
│  Next.js App Router (React Server Components + Client)    │
│  Tailwind CSS                                              │
└───────────────┬─────────────────────────┬─────────────────┘
                │                          │
                │ Supabase JS Client       │ wa.me deep link
                ▼                          ▼
┌─────────────────────────────┐   ┌──────────────────────┐
│         SUPABASE             │   │      WhatsApp          │
│  - Postgres (products table) │   │  (external redirect)   │
│  - Storage (product-images)  │   └──────────────────────┘
│  - Auth (admin only)         │
│  - RLS: public read /        │
│    authenticated write       │
└─────────────────────────────┘
                ▲
                │ Authenticated writes only
                │
┌─────────────────────────────┐
│   /admin (password-gated)    │
│   Mobile-first CMS (iPhone/  │
│   iPad optimized)            │
└─────────────────────────────┘
```

**Hosting:** Vercel (Free Tier), frontend only. Supabase is the sole backend (BaaS — no custom server needed beyond Next.js route handlers/server actions).

**DNS/Domain:** Out of scope for the agent. Client's nephew handles DNS → Vercel. Do not build any domain-management logic.

---

## 3. Tech Stack (Locked — do not substitute)

- **Framework:** Next.js, App Router (`app/` directory), React Server Components by default, Client Components only where interactivity requires it (`"use client"`).
- **Styling:** Tailwind CSS (utility-first, mobile-first breakpoints).
- **Backend:** Supabase (Postgres + Storage + Auth).
- **Data fetching:** `@supabase/supabase-js` + `@supabase/ssr` for server/client Supabase clients.
- **Deployment:** Vercel.
- **No** payment SDKs (Paystack, Stripe, Flutterwave) are to be installed under any circumstance.

---

## 4. File / Folder Structure (Next.js App Router)

```
elmik-stitches/
├── app/
│   ├── layout.tsx                     # Root layout, fonts, metadata
│   ├── page.tsx                       # Home page (hero + featured products)
│   ├── globals.css                    # Tailwind directives
│   │
│   ├── shop/
│   │   ├── page.tsx                   # Full catalog, category filters
│   │   └── [category]/
│   │       └── page.tsx               # Category-filtered view (Gowns, Dresses, etc.)
│   │
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx               # Single product detail + Order button
│   │
│   ├── size-chart/
│   │   └── page.tsx                   # Static visual size guide (S–XXL measurements)
│   │
│   ├── custom-order/
│   │   └── page.tsx                   # "Request Custom Outfit" form
│   │
│   ├── about/
│   │   └── page.tsx                   # About Us (client-provided copy)
│   │
│   ├── contact/
│   │   └── page.tsx                   # Store info + embedded Google Map
│   │
│   ├── gallery/
│   │   └── page.tsx                   # Customer photo gallery (masonry grid, no product links)
│   │
│   ├── admin/
│   │   ├── layout.tsx                 # Auth guard wrapper, mobile-first shell
│   │   ├── login/
│   │   │   └── page.tsx               # Supabase Auth email/password login
│   │   ├── page.tsx                   # Dashboard: product list, stock toggle
│   │   ├── products/
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Add product form (photo upload)
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx       # Edit product form
│   │   ├── gallery/
│   │   │   └── page.tsx               # Admin gallery management (add/delete photos)
│   │   └── actions.ts                 # Server actions: create/update/delete product, gallery items
│   │
│   └── api/
│       └── (none required — use Server Actions instead of API routes
│            wherever possible, per Next.js App Router best practice)
│
├── components/
│   ├── ui/                            # Buttons, Badge, Modal, Skeletons
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CategoryFilterBar.tsx
│   ├── OrderButton.tsx                # Invokes WhatsApp round-robin util
│   ├── SizeChartModal.tsx
│   ├── CustomOrderForm.tsx
│   ├── GoogleMapEmbed.tsx
│   ├── GalleryGrid.tsx                # Masonry/flexible grid for customer photos
│   ├── GalleryLightbox.tsx            # Optional full-screen image viewer
│   └── admin/
│       ├── AdminNav.tsx               # Bottom tab bar (mobile-first)
│       ├── ProductForm.tsx
│       ├── ImageUploader.tsx
│       ├── StockToggle.tsx
│       └── GalleryUploadForm.tsx      # Admin gallery photo upload + caption
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client
│   │   ├── server.ts                  # Server Supabase client (SSR/RSC)
│   │   └── middleware.ts              # Session refresh helper
│   ├── whatsapp/
│   │   └── roundRobin.ts              # CRITICAL: WhatsApp load-balancer logic
│   ├── utils/
│   │   └── currency.ts                # formatNaira() — Intl.NumberFormat wrapper
│   ├── types.ts                       # Product, CustomOrderRequest, GalleryImage TS types
│   └── constants.ts                   # Categories, sizes, brand info
│
├── middleware.ts                      # Protects /admin/* routes (session check)
├── public/
│   ├── og-image.jpg                   # 1200x630 default Open Graph share image
│   └── (static assets, logo, favicon)
├── .env.local                         # NEXT_PUBLIC_SUPABASE_URL, ANON_KEY
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 5. User Flows

### 5.1 Customer Flow (Public, No Auth)

1. Lands on `/` → sees hero banner + featured products (pulled from `products` where `in_stock = true`).
2. Navigates to `/shop` → browses full catalog, filters by category (Gowns, Dresses, Tops, Two-Piece, Jeans, Skirts, Casual).
3. Clicks a product → `/product/[id]` → sees:
   - Image gallery
   - Title, price (₦, formatted with thousands separator)
   - Size selector (only sizes present in that product's `sizes` array are selectable)
   - Color selector (if applicable)
   - Stock badge (In Stock / Out of Stock)
   - Link to `/size-chart` (opens as modal or new page)
4. **If `in_stock === true`:** selects size + color → clicks **"Order via WhatsApp"**.
   **If `in_stock === false`:** the button relabels to **"Request Restock via WhatsApp"** (still enabled — see Section 8 for exact logic) and selects size + color as normal before sending.
5. `roundRobin.ts` selects one of the two numbers → constructs `wa.me` URL with the appropriate pre-filled message (order or restock request) → opens in new tab.
6. Alternative path: Customer wants a custom/bulk piece → navigates to `/custom-order` → fills form (name, phone, measurements, fabric choice, event date, notes) → form itself is either:
   - Submitted directly to WhatsApp via a pre-filled message (recommended, consistent with "no backend order table" philosophy), OR
   - Optionally stored in a lightweight `custom_order_requests` table (see SCHEMA.sql, optional table) for the admin to review — **only if client wants a record**. Default behavior: route to WhatsApp, same as product orders.
7. Customer can view `/about`, `/contact` (with embedded Google Map), and `/gallery` (customer photos wearing Elmik pieces) at any time via persistent nav. The gallery is purely visual — images are not linked to specific products (see Section 11).

### 5.2 Admin Flow (Authenticated, Mobile-First)

1. Admin (store owner) opens `/admin` on iPhone/iPad.
2. `middleware.ts` checks Supabase session → if none, redirect to `/admin/login`.
3. `/admin/login` → email + password form (Supabase Auth, single admin user, no public signup).
4. On success → redirected to `/admin` dashboard:
   - List of all products (thumbnail, title, price, stock toggle switch) in a scrollable mobile list.
   - Bottom tab bar navigation: Dashboard / Add Product / Gallery / Logout.
5. **Add Product** (`/admin/products/new`):
   - Upload photo (camera roll or camera directly — `<input type="file" accept="image/*" capture>`) → uploads to Supabase Storage bucket `product-images` → gets public URL.
   - Enter title, price, category (dropdown), sizes (multi-select chips: S/M/L/XL/XXL), color(s), stock status toggle.
   - Submit → Server Action inserts row into `products` table.
6. **Edit Product** (`/admin/products/[id]/edit`): same form, pre-filled, with Delete option (confirm dialog).
7. **Toggle stock**: inline switch on dashboard list — single tap, optimistic UI update, Server Action patches `in_stock` boolean.
8. **Manage Gallery** (`/admin/gallery`): upload customer photos (camera roll/camera), optional caption, delete existing photos. See Section 11 for full detail.
9. Session persists via Supabase cookie-based auth (SSR-compatible) — no need to re-login every visit within token expiry window.

---

## 6. WhatsApp Round-Robin Load Balancer — Detailed Logic

**File:** `lib/whatsapp/roundRobin.ts`

**Requirement:** Orders must alternate **evenly** between:
- `08075514345`
- `08033109393`

**Design constraints:**
- Next.js on Vercel is stateless/serverless — in-memory counters (`let counter = 0`) do **NOT** persist reliably across requests/invocations (each request may hit a cold serverless function/new container). A pure in-memory counter will NOT guarantee even alternation in production.
- The router must guarantee a **genuinely even 50/50 split** of outbound orders across the two numbers. The agent must implement this using **one** of the two mandated client-side strategies below (strict alternation is preferred; randomized is an acceptable fallback if strict alternation proves awkward with the chosen state approach) — do not invent a third strategy.

**Mandated implementation — Strategy A: `localStorage` strict alternation (default, preferred)**

1. Use `localStorage` (client-side only, guarded with `typeof window !== "undefined"`, with an in-memory fallback for environments where `localStorage` is unavailable — e.g., private browsing edge cases) to store the last-used index (`0` or `1`) under a dedicated key, e.g. `elmik_last_wa_index`.
2. On each "Order" / "Request Restock" click:
   - Read `elmik_last_wa_index` from `localStorage` (default to `-1` if unset, so the very first click on a fresh browser always resolves to index `0`).
   - Compute `nextIndex = (lastIndex + 1) % 2`.
   - Write `nextIndex` back to `localStorage` **before** opening the WhatsApp link (so a user who clicks twice in a row, even across a page reload, still alternates correctly).
   - Use the number at `nextIndex` to build the `wa.me` link.
3. This guarantees strict, deterministic 50/50 alternation **per browser/device** — the standard and expected behavior of a round-robin load balancer.

**Mandated implementation — Strategy B: Randomized 50/50 hook (acceptable alternative)**

1. Implement `useRandomWhatsAppNumber()` (or an equivalent pure function) that calls `Math.random()` and returns index `0` if `< 0.5`, otherwise index `1`.
2. No persisted state is required for this strategy since each call is independently randomized at true 50% probability — acceptable because, over any meaningful volume of orders, the law of large numbers converges to an even split. This is a simpler implementation with a probabilistic (not deterministic) guarantee, and is offered as a fallback only if Strategy A is not used.

**The agent must pick Strategy A (`localStorage` alternation) as the default implementation** unless there is a concrete technical blocker, and note in code comments which strategy was used.

**Optional future upgrade (not required for v1):** a Postgres-backed single-row counter table (`whatsapp_router`, function `get_next_whatsapp_index()` — provided in `SCHEMA.sql`) exists and can be wired up later via Supabase RPC for cross-device/global fairness, if the client ever wants alternation to be consistent across every visitor rather than per-browser. Not required for launch; do not block on this.

**Function signature:**

```ts
// lib/whatsapp/roundRobin.ts

const WHATSAPP_NUMBERS = ["2348075514345", "2348033109393"]; // E.164 format, no leading 0, prefixed with 234
const STORAGE_KEY = "elmik_last_wa_index";

interface OrderDetails {
  title: string;
  size: string;
  color?: string;
  price: number;       // in Naira
  isRestockRequest?: boolean; // true when product.in_stock === false
}

// Strategy A — strict alternation via localStorage (default)
export function getNextWhatsAppNumber(): string {
  if (typeof window === "undefined") {
    // SSR guard — should never be called server-side, but fail safe to index 0
    return WHATSAPP_NUMBERS[0];
  }
  const lastIndexRaw = window.localStorage.getItem(STORAGE_KEY);
  const lastIndex = lastIndexRaw === null ? -1 : parseInt(lastIndexRaw, 10);
  const nextIndex = (lastIndex + 1) % 2;
  window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
  return WHATSAPP_NUMBERS[nextIndex];
}

export function buildWhatsAppMessage(order: OrderDetails): string {
  const formattedPrice = formatNaira(order.price); // see Section 10 — lib/utils/currency.ts

  if (order.isRestockRequest) {
    return encodeURIComponent(
      `Hello Elmik Stitches, this item is currently out of stock but I'd like to be notified when it's back:\n\n` +
      `*Item:* ${order.title}\n` +
      `*Size:* ${order.size}\n` +
      (order.color ? `*Color:* ${order.color}\n` : "") +
      `*Price:* ${formattedPrice}\n\n` +
      `Please let me know when it's restocked.`
    );
  }

  return encodeURIComponent(
    `Hello Elmik Stitches, I'd like to order:\n\n` +
    `*Item:* ${order.title}\n` +
    `*Size:* ${order.size}\n` +
    (order.color ? `*Color:* ${order.color}\n` : "") +
    `*Price:* ${formattedPrice}\n\n` +
    `Please confirm availability.`
  );
}

export function getWhatsAppOrderUrl(order: OrderDetails): string {
  const number = getNextWhatsAppNumber();
  const message = buildWhatsAppMessage(order);
  return `https://wa.me/${number}?text=${message}`;
}
```

**Phone number format note:** `wa.me` links require international format **without** the leading `0` and **without** `+`. Nigerian numbers `08075514345` and `08033109393` must be converted to `2348075514345` and `2348033109393` respectively. This conversion is hardcoded in the constant above — the agent must not pass the raw local-format numbers to `wa.me`.

---

## 7. Image Performance & Loading Strategy (Mandatory)

The catalog launches with 100+ product images, so image handling is a first-class architectural concern, not an afterthought.

- **`next/image` is mandatory** for every product image (grid thumbnails, product detail gallery, admin previews) — raw `<img>` tags are not permitted for catalog images.
- **Fixed aspect ratio:** all product images must be constrained to a standard **3:4 portrait aspect ratio** (the fashion-industry standard), enforced via a wrapper `div` with `aspect-[3/4]` (Tailwind) and `next/image`'s `fill` prop with `object-cover`. This prevents layout shift regardless of the source photo's native dimensions, and keeps the grid visually consistent across 100+ differently-shot images.
- **Blur-up placeholders:** every `next/image` instance must set `placeholder="blur"` with a `blurDataURL`. Since product photos are uploaded by the admin via the CMS (not available at build time), generate a lightweight blur placeholder using one of:
  - A shared, generic solid-color/gradient base64 placeholder (simplest — acceptable for v1) applied uniformly to all product images, **or**
  - A tiny server-side blurred thumbnail generated at upload time (e.g., via the `plaiceholder` package) and stored alongside `image_url` — a `blur_data_url` column exists as an optional future enhancement to `products` if the agent wants to implement this properly. For v1, the shared generic placeholder is sufficient and preferred for simplicity.
- **Responsive `sizes` prop:** every grid image must declare a `sizes` attribute matching the actual rendered breakpoints (e.g., `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"` for a 2/3/4-column responsive grid) so the browser never downloads a larger image than needed.
- **Lazy loading by default:** rely on `next/image`'s built-in lazy loading (`loading="lazy"` is the default) for all grid/gallery images below the fold. Only the single hero/first-viewport image on `/` and the primary product image on `/product/[id]` should use `priority` to avoid layout-shift-related Core Web Vitals penalties.
- **Remote image config:** `next.config.js` → `images.remotePatterns` must explicitly allow the Supabase Storage hostname (`<project-ref>.supabase.co`) — no other external image domains are needed.

---

## 8. Out-of-Stock / Restock UX Logic (Mandatory)

The Order button on `/product/[id]` (via `components/OrderButton.tsx`) must react to the product's `in_stock` boolean as follows — this is not optional UI polish, it is required behavior:

| `in_stock` | Button Label | Button State | WhatsApp Message Type |
|---|---|---|---|
| `true` | "Order via WhatsApp" | Enabled (once size/color selected) | Standard order message (see Section 6) |
| `false` | "Request Restock via WhatsApp" | **Still enabled** (once size/color selected) | Restock-request message (see Section 6, `isRestockRequest: true`) |

- The button must **never simply disable and go dead** when a product is out of stock — that is a lost lead. Instead it relabels and re-purposes itself to capture restock interest, still routed through the same round-robin load balancer (Section 6) so restock inquiries are evenly distributed too.
- The visual style should shift (e.g., primary/brand-colored button for in-stock orders → a secondary/outline style for restock requests) so customers can tell at a glance the item isn't immediately available, without the CTA disappearing.
- The stock badge near the title (In Stock / Out of Stock) remains a separate, always-visible visual indicator independent of the button.
- `OrderButton.tsx` derives its label, style, and message payload purely from the `product.in_stock` prop passed down from the Server Component — no separate client-side stock re-fetch is needed.

---

## 9. SEO & Social Sharing (Open Graph)

Since links to the storefront will be shared on WhatsApp, Instagram, and Facebook, every page must render correct Open Graph and Twitter Card metadata so link previews show a proper image, title, and description instead of a bare URL.

- **Root layout (`app/layout.tsx`):** define a default/site-wide `metadata` export (Next.js Metadata API) including:
  - `title` / `title.template` (e.g., `"%s | Elmik Stitches"`)
  - `description` (brand tagline)
  - `openGraph: { type: "website", siteName: "Elmik Stitches", images: ["/og-image.jpg"] }` — a static 1200×630 default share image lives at `public/og-image.jpg`
  - `twitter: { card: "summary_large_image" }`
- **Product detail pages (`app/product/[id]/page.tsx`):** override the default via `generateMetadata`, dynamically setting:
  - `title`: the product title
  - `description`: a short excerpt of the product description (or a generated fallback like `"${title} — available now at Elmik Stitches"`)
  - `openGraph.images`: the product's own `image_url` (falls back to the site-wide `og-image.jpg` if missing), ensuring a shared product link previews the actual garment photo.
- **Category and shop pages:** use static or lightly-dynamic `generateMetadata` (e.g., `"Shop ${category} | Elmik Stitches"`).
- All OG image URLs must be **absolute URLs** (not relative paths) — Next.js `metadataBase` must be set in the root layout (e.g., the production Vercel URL) so relative `images` paths resolve correctly when scraped by WhatsApp/Instagram/Facebook's link-preview bots.
- This is required for every page type in the app (home, shop, category, product, custom-order, about, contact) — no page should fall back to a title-less/description-less share card.

---

## 10. Currency Formatting Utility (Mandatory, Single Source of Truth)

All Naira price displays across the entire app (product cards, product detail, WhatsApp messages, admin forms) must go through **one shared utility function** — no ad-hoc `Intl.NumberFormat` calls scattered across components.

**File:** `lib/utils/currency.ts`

```ts
// lib/utils/currency.ts

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric price into a clean Nigerian Naira string.
 * e.g. formatNaira(25000) -> "₦25,000"
 */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
```

- `ProductCard.tsx`, the product detail page, `ProductForm.tsx` (admin, for live preview), and `buildWhatsAppMessage()` (Section 6) must all import and use `formatNaira()` rather than instantiating their own formatter.
- No decimal places are shown (Naira prices are conventionally whole numbers in this catalog's context) — `minimumFractionDigits: 0` / `maximumFractionDigits: 0` is intentional and must not be changed without explicit client request.

---

## 11. Gallery Feature (Customer Photos)

A dedicated **social-proof gallery** showcasing customer photos wearing Elmik Stitches pieces. This is a separate concern from the product catalog — gallery images are **not linked to any product** and exist purely to build trust/visual credibility.

### 11.1 Data Model
A new `gallery_images` table (see `SCHEMA.sql`), independent of `products`:
- `id`, `image_url`, `caption` (optional — e.g. customer name or short quote), `display_order` (optional manual ordering), `created_at`.
- Public **SELECT** (anon + authenticated), admin-only **INSERT/UPDATE/DELETE** — same RLS pattern as `products`.

### 11.2 Storage
A separate public Supabase Storage bucket, `gallery-images`, kept distinct from `product-images` so the two upload flows never get confused in the admin UI. Same storage RLS pattern (public read, authenticated write/update/delete).

### 11.3 Public Page — `/gallery`
- Server Component, fetches all rows ordered by `display_order`, then `created_at desc`.
- Rendered as a **responsive masonry/flexible grid** — explicitly **not** the fixed 3:4 aspect-ratio grid used on `/shop` (Section 7), since customer-submitted photos have varying natural aspect ratios and forcing a crop would look unnatural for this content type. Use CSS columns-based masonry or a grid with `auto-rows`, with `next/image` sized to each image's natural dimensions.
- Lazy-load all images except the first few above the fold.
- Optional caption shown as an overlay or beneath each image, if present.
- Empty state: "No gallery photos yet — check back soon!"
- `generateMetadata` following the same OG/title pattern as every other page (Section 9).
- Added to the persistent header/footer nav alongside Shop, Custom Order, Size Guide, About, Contact.

### 11.4 Admin Page — `/admin/gallery`
- New tab in the mobile-first admin bottom nav (`AdminNav.tsx`), alongside Dashboard and Add Product.
- Scrollable list/grid of existing gallery images (thumbnail, caption, delete button).
- "Add Photo" flow reuses the same camera-capture-enabled uploader pattern (`<input type="file" accept="image/*" capture="environment">`) used for product photo uploads → uploads to `gallery-images` bucket → optional caption text field → Server Action inserts into `gallery_images`.
- Delete removes both the database row and the associated Storage object (same pattern as product deletion).
- No "edit" flow required for v1 — add/delete only.

### 11.5 Explicitly Out of Scope (Gallery)
- No linking gallery images to specific products.
- No customer-facing upload — admin-only, same trust boundary as the rest of the CMS.
- No likes/comments/social interaction features.

---

## 12. Non-Functional Requirements

- **Mobile-first:** All pages, especially `/admin`, must be designed mobile-first (base Tailwind classes = mobile, `md:`/`lg:` = enhancements). Admin will exclusively use iPhone/iPad.
- **No authentication for customers** — public site requires zero login/signup.
- **Single admin user** — no multi-admin, no role system, no public registration flow. Admin account created manually via Supabase Dashboard, not through app UI.
- **SEO:** Product, category, and gallery pages should be server-rendered (RSC) for indexability; use `generateMetadata` per page (see Section 9 for full OG requirements).

---

## 13. Explicitly Out of Scope

- Shopping cart / multi-item checkout
- Payment gateway integration (Paystack, Stripe, Flutterwave, etc.)
- Automated shipping/delivery fee calculation
- Order status tracking / order history for customers
- Multi-admin roles or permissions
- Inventory quantity tracking (only a boolean `in_stock` flag is required)
- Reviews/ratings system
- Wishlist/favorites
- Domain/DNS configuration
- Gallery-to-product linking, customer-facing gallery uploads, gallery social interactions (see Section 11.5)
