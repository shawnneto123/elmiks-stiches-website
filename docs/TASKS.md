# TASKS.md — Elmik Stitches Build Plan

**Instructions for the AI coding agent:** Execute phases in order. Do not skip ahead. Each task is a discrete, checkable unit of work. Reference `PRD.md` for architecture/flow decisions and `SCHEMA.sql` for exact database structure. Do not deviate from the tech stack (Next.js App Router + Tailwind + Supabase) or introduce a payment gateway/cart system — this app is catalog + WhatsApp-lead-generation only.

---

## Phase 1 — Project Setup & Database

- [x] Initialize a new Next.js project with App Router, TypeScript, and Tailwind CSS enabled (`create-next-app` with `--typescript --tailwind --app`).
- [x] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`.
- [x] Create a new Supabase project (or confirm existing project credentials are provided).
- [x] Run the full contents of `SCHEMA.sql` in the Supabase SQL Editor. Verify no errors.
- [x] Confirm in Supabase Dashboard: `products`, `custom_order_requests`, `whatsapp_router` tables exist; RLS is enabled on all three.
- [x] Confirm the `product-images` storage bucket exists and is marked public.
- [x] Manually create the single admin user in Supabase Dashboard → Authentication → Users (email + strong password, Auto Confirm = true). Record credentials for handoff to client.
- [x] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Add `.env.local` to `.gitignore`.
- [x] Scaffold the full folder structure exactly as defined in `PRD.md` Section 4 (empty files/placeholders acceptable at this stage).
- [x] Configure `next.config.js` `images.remotePatterns` to allow the Supabase project's storage hostname (`<project-ref>.supabase.co`).
- [x] Create `lib/supabase/client.ts` (browser client) and `lib/supabase/server.ts` (server/RSC client) per Supabase SSR docs.
- [x] Create `lib/types.ts` with a `Product` TypeScript interface matching the `products` table columns exactly.
- [x] Create `lib/constants.ts` with the `CATEGORIES` array (`Gowns`, `Dresses`, `Tops`, `Two-Piece`, `Jeans`, `Skirts`, `Casual`) and `SIZES` array (`S`, `M`, `L`, `XL`, `XXL`).
- [x] Configure `tailwind.config.ts` with the design tokens from `PRD.md` Section 4: `fontFamily.serif` (display face, e.g. Playfair Display), `fontFamily.sans` (body face, e.g. Inter), and `colors.brand.accent` (luxury gold `#C5A059`). Load both fonts via `next/font/google` in `app/layout.tsx` and expose them as CSS variables consumed by the Tailwind config.

---

## Phase 2 — UI Shell & Static Pages

- [x] Build `app/layout.tsx`: global font, `<html lang="en">`, metadata (title: "Elmik Stitches", description), persistent header + footer.
- [x] Build a responsive `Header` component: logo/brand name, nav links (Shop, Custom Order, Size Chart, About, Contact), mobile hamburger menu.
- [x] Build a `Footer` component: brand name, Instagram link (@elmik_stitches), physical address, operating hours (9AM–5:30PM store / 24/7 online), copyright line.
- [x] Build `app/page.tsx` (Home): hero section, "Shop Now" CTA, placeholder featured-products grid (static/mock data acceptable at this stage — wired to real data in Phase 3).
- [x] Build `app/about/page.tsx`: static page using client-provided "About Us" copy (use placeholder lorem text if copy not yet supplied, clearly marked `TODO: insert client copy`).
- [x] Build `app/contact/page.tsx`: display store address, hours, and an embedded Google Map iframe centered on House 67, 2nd Avenue, Efab City Estate, Jabi, Mbora, FCT, Abuja.
- [x] Build `app/size-chart/page.tsx`: static visual size guide — table or diagram mapping S/M/L/XL/XXL to body measurements (bust, waist, hips, length). Use placeholder measurement values marked `TODO: confirm exact measurements with client`.
- [x] Build `components/SizeChartModal.tsx` as an alternate/additional modal-based access point to the same size data, triggerable from the product detail page.
- [x] Ensure every page built in this phase is mobile-first responsive (test at 375px, 768px, 1280px widths).

---

## Phase 3 — Dynamic Data (Supabase Integration)

- [x] Build `components/ProductCard.tsx`: image (via `next/image`), title, price (formatted ₦ via `Intl.NumberFormat`), in-stock badge.
- [x] Build `components/ProductGrid.tsx`: responsive grid (2 cols mobile, 3–4 cols desktop) rendering an array of `ProductCard`.
- [x] Build `components/CategoryFilterBar.tsx`: horizontally scrollable (mobile) filter chips for the 7 categories + "All".
- [x] Build `app/shop/page.tsx` as a Server Component: fetch all products from Supabase (`select * from products order by created_at desc`), render via `ProductGrid`, with `CategoryFilterBar` for client-side or query-param-based filtering.
- [x] Build `app/shop/[category]/page.tsx`: server-fetch products filtered `where category = :category`, validate category param against `CATEGORIES` constant, `notFound()` if invalid.
- [x] Wire `app/page.tsx` home featured-products section to a real Supabase query (e.g., latest 8 in-stock products), replacing Phase 2 placeholder data.
- [x] Build `app/product/[id]/page.tsx` as a Server Component: fetch single product by `id`, `notFound()` if missing. Render image gallery (main `image_url` + `image_urls`), title, description, price, size selector (only enabled for sizes in the product's `sizes` array), color selector (if `colors` present), stock badge.
- [x] Add `generateMetadata` to the product detail page for per-product SEO titles/descriptions.
- [x] Build `app/custom-order/page.tsx` with `components/CustomOrderForm.tsx` (Client Component): fields for full name, phone number, measurements, fabric choice, event date, notes. On submit, either (a) route directly to a pre-filled WhatsApp message, or (b) insert into `custom_order_requests` via a Server Action and then redirect to WhatsApp as confirmation — implement option (a) as the default per PRD Section 5.1, with a code comment noting option (b) is available if the client wants persisted records.
- [x] Add client-side and server-side (Server Action) form validation for `CustomOrderForm` (required fields, phone number format).
- [x] Add loading states (`loading.tsx`) and empty states ("No products in this category yet") to `shop` and `shop/[category]` routes.
- [x] Add `not-found.tsx` for invalid product/category routes.

---

## Phase 4 — WhatsApp Round-Robin Routing

- [x] Create `lib/whatsapp/roundRobin.ts` implementing `getNextWhatsAppNumber()`, `buildWhatsAppMessage()`, and `getWhatsAppOrderUrl()` exactly per the logic and code skeleton in `PRD.md` Section 6.
- [x] Hardcode `WHATSAPP_NUMBERS = ["2348075514345", "2348033109393"]` — verify the E.164 conversion from the raw local numbers (`08075514345`, `08033109393`) is correct (strip leading `0`, prepend `234`).
- [x] **Preferred implementation:** wire `getNextWhatsAppNumber()` to call the `get_next_whatsapp_index()` Postgres function via Supabase RPC (`supabase.rpc('get_next_whatsapp_index')`) so alternation is globally fair across all customers/devices, not just per-browser.
- [x] **Fallback implementation (if RPC approach is deprioritized):** implement the `localStorage`-based alternation described in `PRD.md` Section 6, guarded for SSR safety (`typeof window !== "undefined"`).
- [x] Build `components/OrderButton.tsx` (Client Component): on click, disabled state while resolving the WhatsApp URL, then calls `getWhatsAppOrderUrl()` with the selected size/color/price, opens the resulting URL via `window.open(url, "_blank")`.
- [x] When `product.in_stock === false`, relabel the button to "Request Restock via WhatsApp" (outline/ghost style, per `PRD.md` Section 4.4/9) rather than disabling it — the CTA must never go dead.
- [x] Require a size selection (and color selection, if the product has colors) before the Order button becomes clickable — show inline validation if the user clicks without selecting.
- [x] Write a simple manual test plan (documented as comments or a `README` note) confirming: 5 sequential test orders alternate strictly `Number A → Number B → Number A → Number B → Number A`.
- [x] Verify the pre-filled WhatsApp message renders correctly on both iOS and Android WhatsApp (line breaks, bold `*text*` formatting, emoji-free, URL-encoded correctly).

---

## Phase 5 — Mobile-First Admin Dashboard

- [x] Create `middleware.ts` at project root: check for a valid Supabase session on any request to `/admin/*` (excluding `/admin/login`); redirect unauthenticated requests to `/admin/login`.
- [x] Build `app/admin/login/page.tsx`: email + password form (Client Component) calling `supabase.auth.signInWithPassword()`. On success, redirect to `/admin`. On failure, show inline error.
- [x] Build `app/admin/layout.tsx`: wraps all `/admin/*` pages (except `/admin/login`) with a mobile-first shell — top bar with brand + logout button, bottom tab navigation (`components/admin/AdminNav.tsx`) with icons for Dashboard / Add Product.
- [x] Build `app/admin/page.tsx` (Dashboard): server-fetch all products (including out-of-stock), render as a scrollable mobile list — thumbnail, title, price, and an inline `components/admin/StockToggle.tsx` switch per row.
- [x] Implement `StockToggle.tsx` as a Client Component calling a Server Action to `update products set in_stock = :value where id = :id`, with optimistic UI update.
- [x] Build `components/admin/ImageUploader.tsx`: `<input type="file" accept="image/*" capture="environment">` (enables direct camera capture on iPhone/iPad), preview thumbnail before upload, uploads to Supabase Storage bucket `product-images` under a unique filename (e.g., `${uuid()}-${originalFilename}`), returns the public URL.
- [x] Build `components/admin/ProductForm.tsx`: title, description, price (numeric input), category (native `<select>` for mobile usability), sizes (multi-select chip toggles), colors (comma-separated text input or chip input), image uploader, in-stock toggle. Shared between Add and Edit flows.
- [x] Build `app/admin/products/new/page.tsx`: renders `ProductForm` in "create" mode, submits via Server Action (`app/admin/actions.ts` → `createProduct()`) that inserts into `products`.
- [x] Build `app/admin/products/[id]/edit/page.tsx`: server-fetch the product, pre-fill `ProductForm` in "edit" mode, submits via `updateProduct()` Server Action. Include a "Delete Product" button with a confirm dialog calling `deleteProduct()` Server Action (also removes the associated Storage object).
- [x] Add form validation (required title, price > 0, at least one size selected, image required on create) with mobile-friendly inline error messages.
- [x] Add a logout button (top bar) calling `supabase.auth.signOut()` and redirecting to `/admin/login`.
- [x] Test the full admin flow end-to-end on a simulated mobile viewport (375px width minimum): login → add product with photo → verify it appears on `/shop` → toggle stock off → verify Order button disables on the storefront → edit price → delete product.
- [x] Confirm no admin route or component leaks data to unauthenticated users (RLS + middleware double-check).

---

## Final Deployment Checklist (Post-Phase 5)

- [x] Push repository to GitHub/GitLab.
- [ ] Connect repository to Vercel (Free Tier), set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Vercel environment variables.
- [ ] Trigger production deploy, verify build succeeds with zero TypeScript/ESLint errors.
- [ ] Smoke-test the live Vercel URL: home page loads, shop page loads with real products, product detail + Order button opens WhatsApp correctly, admin login works, admin can add/edit/toggle a product live.
- [ ] Hand off the Vercel production URL to the client for DNS pointing (client's nephew handles domain registration/DNS — out of scope for the agent).
