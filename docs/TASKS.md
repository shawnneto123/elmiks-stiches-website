# TASKS.md — Elmik Stitches Build Plan

**Instructions for the AI coding agent:** Execute phases in order. Do not skip ahead. Each task is a discrete, checkable unit of work. Reference `PRD.md` for architecture/flow decisions and `SCHEMA.sql` for exact database structure. Do not deviate from the tech stack (Next.js App Router + Tailwind + Supabase) or introduce a payment gateway/cart system — this app is catalog + WhatsApp-lead-generation only.

---

## Phase 1 — Project Setup & Database

- [ ] Initialize a new Next.js project with App Router, TypeScript, and Tailwind CSS enabled (`create-next-app` with `--typescript --tailwind --app`).
- [ ] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`.
- [ ] Create a new Supabase project (or confirm existing project credentials are provided).
- [ ] Run the full contents of `SCHEMA.sql` in the Supabase SQL Editor. Verify no errors.
- [ ] Confirm in Supabase Dashboard: `products`, `custom_order_requests`, `whatsapp_router` tables exist; RLS is enabled on all three.
- [ ] Confirm the `product-images` storage bucket exists and is marked public.
- [ ] Manually create the single admin user in Supabase Dashboard → Authentication → Users (email + strong password, Auto Confirm = true). Record credentials for handoff to client.
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Add `.env.local` to `.gitignore`.
- [ ] Scaffold the full folder structure exactly as defined in `PRD.md` Section 4 (empty files/placeholders acceptable at this stage).
- [ ] Configure `next.config.js` `images.remotePatterns` to allow the Supabase project's storage hostname (`<project-ref>.supabase.co`).
- [ ] Create `lib/supabase/client.ts` (browser client) and `lib/supabase/server.ts` (server/RSC client) per Supabase SSR docs.
- [ ] Create `lib/types.ts` with a `Product` TypeScript interface matching the `products` table columns exactly.
- [ ] Create `lib/constants.ts` with the `CATEGORIES` array (`Gowns`, `Dresses`, `Tops`, `Two-Piece`, `Jeans`, `Skirts`, `Casual`) and `SIZES` array (`S`, `M`, `L`, `XL`, `XXL`).
- [ ] Configure `tailwind.config.ts` with the design tokens from `PRD.md` Section 4: `fontFamily.serif` (display face, e.g. Playfair Display), `fontFamily.sans` (body face, e.g. Inter), and `colors.brand.accent` (default `#25D366` placeholder until client supplies the real logo color). Load both fonts via `next/font/google` in `app/layout.tsx` and expose them as CSS variables consumed by the Tailwind config.

---

## Phase 2 — UI Shell & Static Pages

- [ ] Build `app/layout.tsx`: global font, `<html lang="en">`, metadata (title: "Elmik Stitches", description), persistent header + footer.
- [ ] Build a responsive `Header` component: logo/brand name, nav links (Shop, Custom Order, Size Chart, About, Contact), mobile hamburger menu.
- [ ] Build a `Footer` component: brand name, Instagram link (@elmik_stitchesrtw), physical address, operating hours (9AM–5:30PM store / 24/7 online), copyright line.
- [ ] Build `app/page.tsx` (Home): hero section, "Shop Now" CTA, placeholder featured-products grid (static/mock data acceptable at this stage — wired to real data in Phase 3).
- [ ] Build `app/about/page.tsx`: static page using client-provided "About Us" copy (use placeholder lorem text if copy not yet supplied, clearly marked `TODO: insert client copy`).
- [ ] Build `app/contact/page.tsx`: display store address, hours, and an embedded Google Map iframe centered on House 67, 2nd Avenue, Efab City Estate, Jabi, Mbora, FCT, Abuja.
- [ ] Build `app/size-chart/page.tsx`: static visual size guide — table or diagram mapping S/M/L/XL/XXL to body measurements (bust, waist, hips, length). Use placeholder measurement values marked `TODO: confirm exact measurements with client`.
- [ ] Build `components/SizeChartModal.tsx` as an alternate/additional modal-based access point to the same size data, triggerable from the product detail page.
- [ ] Ensure every page built in this phase is mobile-first responsive (test at 375px, 768px, 1280px widths).

---

## Phase 3 — Dynamic Data (Supabase Integration)

- [ ] Build `components/ProductCard.tsx`: image (via `next/image`), title, price (formatted ₦ via `Intl.NumberFormat`), in-stock badge.
- [ ] Build `components/ProductGrid.tsx`: responsive grid (2 cols mobile, 3–4 cols desktop) rendering an array of `ProductCard`.
- [ ] Build `components/CategoryFilterBar.tsx`: horizontally scrollable (mobile) filter chips for the 7 categories + "All".
- [ ] Build `app/shop/page.tsx` as a Server Component: fetch all products from Supabase (`select * from products order by created_at desc`), render via `ProductGrid`, with `CategoryFilterBar` for client-side or query-param-based filtering.
- [ ] Build `app/shop/[category]/page.tsx`: server-fetch products filtered `where category = :category`, validate category param against `CATEGORIES` constant, `notFound()` if invalid.
- [ ] Wire `app/page.tsx` home featured-products section to a real Supabase query (e.g., latest 8 in-stock products), replacing Phase 2 placeholder data.
- [ ] Build `app/product/[id]/page.tsx` as a Server Component: fetch single product by `id`, `notFound()` if missing. Render image gallery (main `image_url` + `image_urls`), title, description, price, size selector (only enabled for sizes in the product's `sizes` array), color selector (if `colors` present), stock badge.
- [ ] Add `generateMetadata` to the product detail page for per-product SEO titles/descriptions.
- [ ] Build `app/custom-order/page.tsx` with `components/CustomOrderForm.tsx` (Client Component): fields for full name, phone number, measurements, fabric choice, event date, notes. On submit, either (a) route directly to a pre-filled WhatsApp message, or (b) insert into `custom_order_requests` via a Server Action and then redirect to WhatsApp as confirmation — implement option (a) as the default per PRD Section 5.1, with a code comment noting option (b) is available if the client wants persisted records.
- [ ] Add client-side and server-side (Server Action) form validation for `CustomOrderForm` (required fields, phone number format).
- [ ] Add loading states (`loading.tsx`) and empty states ("No products in this category yet") to `shop` and `shop/[category]` routes.
- [ ] Add `not-found.tsx` for invalid product/category routes.

---

## Phase 4 — WhatsApp Round-Robin Routing

- [ ] Create `lib/whatsapp/roundRobin.ts` implementing `getNextWhatsAppNumber()`, `buildWhatsAppMessage()`, and `getWhatsAppOrderUrl()` exactly per the logic and code skeleton in `PRD.md` Section 6.
- [ ] Hardcode `WHATSAPP_NUMBERS = ["2348075514345", "2348033109393"]` — verify the E.164 conversion from the raw local numbers (`08075514345`, `08033109393`) is correct (strip leading `0`, prepend `234`).
- [ ] **Preferred implementation:** wire `getNextWhatsAppNumber()` to call the `get_next_whatsapp_index()` Postgres function via Supabase RPC (`supabase.rpc('get_next_whatsapp_index')`) so alternation is globally fair across all customers/devices, not just per-browser.
- [ ] **Fallback implementation (if RPC approach is deprioritized):** implement the `localStorage`-based alternation described in `PRD.md` Section 6, guarded for SSR safety (`typeof window !== "undefined"`).
- [ ] Build `components/OrderButton.tsx` (Client Component): on click, disabled state while resolving the WhatsApp URL, then calls `getWhatsAppOrderUrl()` with the selected size/color/price, opens the resulting URL via `window.open(url, "_blank")`.
- [ ] When `product.in_stock === false`, relabel the button to "Request Restock via WhatsApp" (outline/ghost style, per `PRD.md` Section 4.4/9) rather than disabling it — the CTA must never go dead.
- [ ] Require a size selection (and color selection, if the product has colors) before the Order button becomes clickable — show inline validation if the user clicks without selecting.
- [ ] Write a simple manual test plan (documented as comments or a `README` note) confirming: 5 sequential test orders alternate strictly `Number A → Number B → Number A → Number B → Number A`.
- [ ] Verify the pre-filled WhatsApp message renders correctly on both iOS and Android WhatsApp (line breaks, bold `*text*` formatting, emoji-free, URL-encoded correctly).

---

## Phase 5 — Mobile-First Admin Dashboard

- [ ] Create `middleware.ts` at project root: check for a valid Supabase session on any request to `/admin/*` (excluding `/admin/login`); redirect unauthenticated requests to `/admin/login`.
- [ ] Build `app/admin/login/page.tsx`: email + password form (Client Component) calling `supabase.auth.signInWithPassword()`. On success, redirect to `/admin`. On failure, show inline error.
- [ ] Build `app/admin/layout.tsx`: wraps all `/admin/*` pages (except `/admin/login`) with a mobile-first shell — top bar with brand + logout button, bottom tab navigation (`components/admin/AdminNav.tsx`) with icons for Dashboard / Add Product.
- [ ] Build `app/admin/page.tsx` (Dashboard): server-fetch all products (including out-of-stock), render as a scrollable mobile list — thumbnail, title, price, and an inline `components/admin/StockToggle.tsx` switch per row.
- [ ] Implement `StockToggle.tsx` as a Client Component calling a Server Action to `update products set in_stock = :value where id = :id`, with optimistic UI update.
- [ ] Build `components/admin/ImageUploader.tsx`: `<input type="file" accept="image/*" capture="environment">` (enables direct camera capture on iPhone/iPad), preview thumbnail before upload, uploads to Supabase Storage bucket `product-images` under a unique filename (e.g., `${uuid()}-${originalFilename}`), returns the public URL.
- [ ] Build `components/admin/ProductForm.tsx`: title, description, price (numeric input), category (native `<select>` for mobile usability), sizes (multi-select chip toggles), colors (comma-separated text input or chip input), image uploader, in-stock toggle. Shared between Add and Edit flows.
- [ ] Build `app/admin/products/new/page.tsx`: renders `ProductForm` in "create" mode, submits via Server Action (`app/admin/actions.ts` → `createProduct()`) that inserts into `products`.
- [ ] Build `app/admin/products/[id]/edit/page.tsx`: server-fetch the product, pre-fill `ProductForm` in "edit" mode, submits via `updateProduct()` Server Action. Include a "Delete Product" button with a confirm dialog calling `deleteProduct()` Server Action (also removes the associated Storage object).
- [ ] Add form validation (required title, price > 0, at least one size selected, image required on create) with mobile-friendly inline error messages.
- [ ] Add a logout button (top bar) calling `supabase.auth.signOut()` and redirecting to `/admin/login`.
- [ ] Test the full admin flow end-to-end on a simulated mobile viewport (375px width minimum): login → add product with photo → verify it appears on `/shop` → toggle stock off → verify Order button disables on the storefront → edit price → delete product.
- [ ] Confirm no admin route or component leaks data to unauthenticated users (RLS + middleware double-check).

---

## Final Deployment Checklist (Post-Phase 5)

- [ ] Push repository to GitHub/GitLab.
- [ ] Connect repository to Vercel (Free Tier), set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Vercel environment variables.
- [ ] Trigger production deploy, verify build succeeds with zero TypeScript/ESLint errors.
- [ ] Smoke-test the live Vercel URL: home page loads, shop page loads with real products, product detail + Order button opens WhatsApp correctly, admin login works, admin can add/edit/toggle a product live.
- [ ] Hand off the Vercel production URL to the client for DNS pointing (client's nephew handles domain registration/DNS — out of scope for the agent).
