-- Migration: 001_initial_schema
-- Banovani E-Commerce — all core tables
-- Run this in your Supabase SQL editor or via: supabase db push

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Updated_at trigger helper ────────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── categories ───────────────────────────────────────────────────────────────
create table if not exists categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        unique not null,
  description text,
  image_url   text,
  sort_order  integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_slug_idx on categories (slug);
create index if not exists categories_sort_order_idx on categories (sort_order);

create trigger categories_updated_at
  before update on categories
  for each row execute function handle_updated_at();

-- ─── products ─────────────────────────────────────────────────────────────────
create table if not exists products (
  id                uuid        primary key default gen_random_uuid(),
  category_id       uuid        references categories (id) on delete set null,
  name              text        not null,
  slug              text        unique not null,
  short_description text,
  description       text,
  price             numeric(10,2) not null check (price >= 0),
  sale_price        numeric(10,2) check (sale_price >= 0),
  fabric_info       text,
  care_info         text,
  delivery_info     text,
  return_info       text,
  seo_title         text,
  seo_description   text,
  is_active         boolean     not null default true,
  is_featured       boolean     not null default false,
  is_new            boolean     not null default false,
  is_sale           boolean     not null default false,
  sort_order        integer     not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_slug_idx       on products (slug);
create index if not exists products_category_idx   on products (category_id);
create index if not exists products_active_idx     on products (is_active);
create index if not exists products_featured_idx   on products (is_featured);
create index if not exists products_sort_order_idx on products (sort_order);

create trigger products_updated_at
  before update on products
  for each row execute function handle_updated_at();

-- ─── product_images ───────────────────────────────────────────────────────────
create table if not exists product_images (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        not null references products (id) on delete cascade,
  image_url   text        not null,
  alt_text    text,
  sort_order  integer     not null default 0,
  is_primary  boolean     not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_idx on product_images (product_id);

-- Ensure only one primary image per product
create unique index if not exists product_images_primary_idx
  on product_images (product_id)
  where is_primary = true;

-- ─── product_variants ─────────────────────────────────────────────────────────
create table if not exists product_variants (
  id             uuid        primary key default gen_random_uuid(),
  product_id     uuid        not null references products (id) on delete cascade,
  sku            text        unique,
  color          text,
  size           text,
  stock          integer     not null default 0 check (stock >= 0),
  price_override numeric(10,2) check (price_override >= 0),
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists product_variants_product_idx on product_variants (product_id);
create index if not exists product_variants_sku_idx     on product_variants (sku);

-- Each color+size combination must be unique per product
create unique index if not exists product_variants_combination_idx
  on product_variants (product_id, color, size)
  where color is not null and size is not null;

create trigger product_variants_updated_at
  before update on product_variants
  for each row execute function handle_updated_at();

-- ─── orders ───────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                   uuid        primary key default gen_random_uuid(),
  order_number         text        unique not null,
  customer_first_name  text        not null,
  customer_last_name   text,
  customer_phone       text        not null,
  customer_email       text,
  city                 text        not null,
  address              text        not null,
  comment              text,
  delivery_method      text,
  payment_method       text,
  payment_status       text        not null default 'pending'
                         check (payment_status in ('pending','paid','failed','refunded','manual_transfer_pending')),
  delivery_status      text        not null default 'not_started'
                         check (delivery_status in ('not_started','preparing','sent','delivered','failed','returned')),
  status               text        not null default 'new'
                         check (status in ('new','confirmed','processing','shipped','completed','cancelled','returned')),
  subtotal             numeric(10,2) not null check (subtotal >= 0),
  delivery_fee         numeric(10,2) not null default 0 check (delivery_fee >= 0),
  discount_total       numeric(10,2) not null default 0 check (discount_total >= 0),
  total                numeric(10,2) not null check (total >= 0),
  admin_note           text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists orders_status_idx       on orders (status);
create index if not exists orders_created_at_idx   on orders (created_at desc);
create index if not exists orders_phone_idx        on orders (customer_phone);
create index if not exists orders_order_number_idx on orders (order_number);

create trigger orders_updated_at
  before update on orders
  for each row execute function handle_updated_at();

-- ─── order_items ──────────────────────────────────────────────────────────────
create table if not exists order_items (
  id            uuid        primary key default gen_random_uuid(),
  order_id      uuid        not null references orders (id) on delete cascade,
  product_id    uuid        references products (id) on delete set null,
  variant_id    uuid        references product_variants (id) on delete set null,
  product_name  text        not null,
  product_image text,
  color         text,
  size          text,
  quantity      integer     not null check (quantity > 0),
  unit_price    numeric(10,2) not null check (unit_price >= 0),
  total_price   numeric(10,2) not null check (total_price >= 0),
  created_at    timestamptz not null default now()
);

create index if not exists order_items_order_idx on order_items (order_id);

-- ─── settings ─────────────────────────────────────────────────────────────────
create table if not exists settings (
  id         uuid        primary key default gen_random_uuid(),
  key        text        unique not null,
  value      jsonb       not null default '""'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger settings_updated_at
  before update on settings
  for each row execute function handle_updated_at();

-- ─── Order number generation function ────────────────────────────────────────
-- Generates order numbers like BNV-1001, BNV-1002, etc.
create sequence if not exists order_number_seq start 1001;

create or replace function generate_order_number()
returns text
language plpgsql
as $$
begin
  return 'BNV-' || nextval('order_number_seq')::text;
end;
$$;
