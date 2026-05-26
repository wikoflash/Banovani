-- Migration: 002_rls_policies
-- Banovani E-Commerce — Row Level Security policies
-- Run AFTER 001_initial_schema.sql

-- ─── Enable RLS on all tables ────────────────────────────────────────────────
alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table settings         enable row level security;

-- ─── categories ──────────────────────────────────────────────────────────────
-- Public: read active categories
create policy "public_read_active_categories"
  on categories for select
  using (is_active = true);

-- Service role: full access (admin operations via server-side API)
create policy "service_role_all_categories"
  on categories for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── products ────────────────────────────────────────────────────────────────
-- Public: read active products
create policy "public_read_active_products"
  on products for select
  using (is_active = true);

-- Service role: full access
create policy "service_role_all_products"
  on products for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── product_images ──────────────────────────────────────────────────────────
-- Public: read images of active products
create policy "public_read_product_images"
  on product_images for select
  using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id
        and p.is_active = true
    )
  );

-- Service role: full access
create policy "service_role_all_product_images"
  on product_images for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── product_variants ────────────────────────────────────────────────────────
-- Public: read active variants of active products
create policy "public_read_active_variants"
  on product_variants for select
  using (
    is_active = true
    and exists (
      select 1 from products p
      where p.id = product_variants.product_id
        and p.is_active = true
    )
  );

-- Service role: full access
create policy "service_role_all_variants"
  on product_variants for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── orders ──────────────────────────────────────────────────────────────────
-- Public: NO direct order reads or writes (all order operations via server API)
-- Service role: full access
create policy "service_role_all_orders"
  on orders for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── order_items ─────────────────────────────────────────────────────────────
-- Public: NO direct access
-- Service role: full access
create policy "service_role_all_order_items"
  on order_items for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── settings ────────────────────────────────────────────────────────────────
-- Public: read non-sensitive settings (delivery info, social links, etc.)
create policy "public_read_settings"
  on settings for select
  using (true);

-- Service role: full access
create policy "service_role_all_settings"
  on settings for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── Storage: product-images bucket ─────────────────────────────────────────
-- Run these only if using Supabase Storage via SQL (otherwise set in dashboard)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Public: read objects in product-images bucket
-- create policy "public_read_product_images_storage"
--   on storage.objects for select
--   using (bucket_id = 'product-images');

-- Service role: upload/delete in product-images bucket
-- create policy "service_role_manage_product_images"
--   on storage.objects for all
--   using (bucket_id = 'product-images' and auth.role() = 'service_role')
--   with check (bucket_id = 'product-images' and auth.role() = 'service_role');
