-- =====================================================================
-- Elmik Stitches — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New Query)
-- Target: Postgres 15+ (Supabase default)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 2. CATEGORY ENUM
-- Locked to the 7 categories defined in the PRD.
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_category') then
    create type product_category as enum (
      'Gowns',
      'Dresses',
      'Tops',
      'Two-Piece',
      'Jeans',
      'Skirts',
      'Casual'
    );
  end if;
end$$;

-- ---------------------------------------------------------------------
-- 3. SIZE ENUM
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_size') then
    create type product_size as enum ('S', 'M', 'L', 'XL', 'XXL');
  end if;
end$$;

-- ---------------------------------------------------------------------
-- 4. PRODUCTS TABLE
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null check (char_length(title) > 0),
  description  text,
  price        numeric(12, 2) not null check (price >= 0),      -- Nigerian Naira, no decimals typically, but numeric allows precision
  category     product_category not null,
  sizes        product_size[] not null default '{}',            -- e.g. '{S,M,L}'
  colors       text[] default '{}',                              -- free-text color names, e.g. '{Red,Black}'
  image_url    text not null,                                    -- primary image, public Supabase Storage URL
  image_urls   text[] default '{}',                              -- optional additional gallery images
  in_stock     boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.products is 'Elmik Stitches product catalog. Public readable, admin-only writable.';

-- Index for common filter/sort patterns
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_in_stock on public.products (in_stock);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- ---------------------------------------------------------------------
-- 5. updated_at AUTO-TOUCH TRIGGER
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 6. (OPTIONAL) CUSTOM ORDER REQUESTS TABLE
-- Only needed if the client wants a persisted record of "Request Custom
-- Outfit" submissions in addition to/instead of routing straight to
-- WhatsApp. Safe to skip if the form routes directly to WhatsApp only.
-- ---------------------------------------------------------------------
create table if not exists public.custom_order_requests (
  id             uuid primary key default uuid_generate_v4(),
  full_name      text not null,
  phone_number   text not null,
  measurements   text,
  fabric_choice  text,
  event_date     date,
  notes          text,
  status         text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at     timestamptz not null default now()
);

comment on table public.custom_order_requests is 'Optional record of bespoke/custom order form submissions for admin review.';

create index if not exists idx_custom_orders_status on public.custom_order_requests (status);
create index if not exists idx_custom_orders_created_at on public.custom_order_requests (created_at desc);

-- ---------------------------------------------------------------------
-- 7. GALLERY_IMAGES TABLE
-- Customer photos wearing Elmik Stitches pieces. Purely visual social
-- proof — deliberately NOT linked to any row in `products`.
-- ---------------------------------------------------------------------
create table if not exists public.gallery_images (
  id             uuid primary key default uuid_generate_v4(),
  image_url      text not null,                      -- public Supabase Storage URL (gallery-images bucket)
  caption        text,                                -- optional, e.g. customer name or short quote
  display_order  integer not null default 0,          -- optional manual ordering in admin (lower = first)
  created_at     timestamptz not null default now()
);

comment on table public.gallery_images is 'Customer photo gallery (social proof). Public readable, admin-only writable. Not linked to products.';

create index if not exists idx_gallery_images_display_order on public.gallery_images (display_order asc, created_at desc);

-- ---------------------------------------------------------------------
-- 8. (OPTIONAL — PREFERRED) GLOBAL WHATSAPP ROUND-ROBIN COUNTER
-- Enables true cross-session, cross-device fair alternation between
-- the two WhatsApp numbers, instead of relying purely on client-side
-- localStorage. Single-row table, atomically updated.
-- ---------------------------------------------------------------------
create table if not exists public.whatsapp_router (
  id          smallint primary key default 1,
  last_index  smallint not null default 0 check (last_index in (0, 1)),
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.whatsapp_router (id, last_index)
values (1, 0)
on conflict (id) do nothing;

-- Atomically flips last_index (0 -> 1, 1 -> 0) and returns the NEW value
-- in a single statement to avoid race conditions between concurrent requests.
create or replace function public.get_next_whatsapp_index()
returns smallint
security definer
set search_path = public
as $$
declare
  new_index smallint;
begin
  update public.whatsapp_router
  set last_index = 1 - last_index,
      updated_at = now()
  where id = 1
  returning last_index into new_index;

  return new_index;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS)
-- Rule: PUBLIC can read products/gallery_images. ONLY an authenticated
-- user (the single admin account) can insert/update/delete.
-- ---------------------------------------------------------------------

-- --- products ---
alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert products" on public.products;
create policy "Authenticated can insert products"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update products" on public.products;
create policy "Authenticated can update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete products" on public.products;
create policy "Authenticated can delete products"
  on public.products
  for delete
  to authenticated
  using (true);

-- --- custom_order_requests (optional table) ---
alter table public.custom_order_requests enable row level security;

drop policy if exists "Public can insert custom order requests" on public.custom_order_requests;
create policy "Public can insert custom order requests"
  on public.custom_order_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read custom order requests" on public.custom_order_requests;
create policy "Authenticated can read custom order requests"
  on public.custom_order_requests
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update custom order requests" on public.custom_order_requests;
create policy "Authenticated can update custom order requests"
  on public.custom_order_requests
  for update
  to authenticated
  using (true)
  with check (true);

-- No public delete/select policy on custom_order_requests — customers
-- can only submit (insert), never read others' submissions.

-- --- gallery_images ---
alter table public.gallery_images enable row level security;

drop policy if exists "Public can read gallery images" on public.gallery_images;
create policy "Public can read gallery images"
  on public.gallery_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert gallery images" on public.gallery_images;
create policy "Authenticated can insert gallery images"
  on public.gallery_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update gallery images" on public.gallery_images;
create policy "Authenticated can update gallery images"
  on public.gallery_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete gallery images" on public.gallery_images;
create policy "Authenticated can delete gallery images"
  on public.gallery_images
  for delete
  to authenticated
  using (true);

-- --- whatsapp_router (optional table) ---
alter table public.whatsapp_router enable row level security;

-- No direct table access needed by clients; access is only through the
-- SECURITY DEFINER function get_next_whatsapp_index(), which bypasses RLS.
-- Deliberately no select/insert/update policies for anon/authenticated here.

-- Allow anon/authenticated to EXECUTE the function (function-level grant,
-- separate from table RLS):
grant execute on function public.get_next_whatsapp_index() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 10. SUPABASE AUTH — ADMIN USER SETUP
-- Supabase Auth is used purely for a single admin login; there is no
-- public sign-up flow in the app UI.
--
-- DO NOT create the admin user via SQL. Instead, after running this
-- script, create the admin account manually via:
--   Supabase Dashboard > Authentication > Users > Add User
--   (set email + password, "Auto Confirm User" = true)
--
-- The Next.js app's /admin/login page authenticates against this user
-- via supabase.auth.signInWithPassword(). No custom "admins" table is
-- required since there is only ever one admin account.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- 11. STORAGE — product-images AND gallery-images BUCKETS
-- Both are public buckets: images must be publicly viewable on the
-- storefront without auth, but only uploadable/deletable by the
-- authenticated admin. Kept as two separate buckets so product photo
-- uploads and gallery photo uploads never get mixed up in the admin UI.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

-- --- product-images policies ---
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');

-- --- gallery-images policies ---
drop policy if exists "Public can view gallery images" on storage.objects;
create policy "Public can view gallery images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "Authenticated can upload gallery images" on storage.objects;
create policy "Authenticated can upload gallery images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "Authenticated can update gallery images" on storage.objects;
create policy "Authenticated can update gallery images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery-images')
  with check (bucket_id = 'gallery-images');

drop policy if exists "Authenticated can delete gallery images" on storage.objects;
create policy "Authenticated can delete gallery images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery-images');

-- =====================================================================
-- END OF SCHEMA
-- After running: create the admin user manually in the Supabase
-- Dashboard (Authentication > Users), then copy the project URL and
-- anon key into the Next.js app's .env.local file:
--   NEXT_PUBLIC_SUPABASE_URL=...
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
-- =====================================================================
